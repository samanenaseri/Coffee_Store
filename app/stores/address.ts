import { defineStore } from 'pinia'
import type {
    Address,
    CreateAddressPayload,
    UpdateAddressPayload,
} from '#shared/address'

function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

function snakeKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(snakeKeys)
    }
    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                toSnakeCase(key),
                snakeKeys(value),
            ]),
        )
    }
    return obj
}

function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function camelKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(camelKeys)
    }
    if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                toCamelCase(key),
                camelKeys(value),
            ]),
        )
    }
    return obj
}

function normalizePhone(phone: string): string {
    let p = String(phone || '').replace(/\D/g, '')
    if (p.length === 10 && p.startsWith('9')) {
        p = `0${p}`
    }
    return p
}

export const useAddressStore = defineStore('address', () => {
    const { apiFetch } = useApi()

    const items = ref<Address[]>([])
    const pending = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const actionError = ref('')
    const isLoaded = ref(false)

    const totalItems = computed(() => items.value.length)

    const defaultAddress = computed(() => {
        return items.value.find(item => item.isDefault) ?? null
    })

    const getAddressById = (id: number) => {
        return items.value.find(item => item.id === id) ?? null
    }

    const extractErrorMessage = (
        err: unknown,
        fallbackMessage: string,
    ) => {
        const fetchError = err as {
            data?: {
                statusMessage?: string
                message?: string
                errors?: Record<string, string[]>
            }
            message?: string
        }

        const validation = fetchError.data?.errors
        if (validation && typeof validation === 'object') {
            const flat = Object.values(validation).flat().filter(Boolean)
            if (flat.length) {
                return flat.join(' ')
            }
        }

        return (
            fetchError.data?.statusMessage
            || fetchError.data?.message
            || fetchError.message
            || fallbackMessage
        )
    }

    const sortAddresses = () => {
        items.value.sort((a, b) => {
            if (a.isDefault !== b.isDefault) {
                return Number(b.isDefault) - Number(a.isDefault)
            }
            return b.id - a.id
        })
    }

    /**
     * Normalize API address payload into Address shape.
     * Handles both list items and { address: {...} } create responses.
     * Note: street field is also named "address" — do not confuse with wrapper.
     */
    const extractAddress = (data: any): Address => {
        let raw = data

        // Unwrap { address: {...}, message?: string } API envelopes
        if (
            data
            && typeof data === 'object'
            && data.address
            && typeof data.address === 'object'
            && !Array.isArray(data.address)
            && (
                data.address.id != null
                || data.address.receiver_name != null
                || data.address.receiverName != null
                || data.address.phone != null
                || data.address.title != null
                || typeof data.message === 'string'
            )
        ) {
            raw = data.address
        }

        // Also unwrap { data: { address } } / { data: address }
        if (
            raw
            && typeof raw === 'object'
            && raw.data
            && typeof raw.data === 'object'
            && !Array.isArray(raw.data)
        ) {
            if (
                raw.data.address
                && typeof raw.data.address === 'object'
                && !Array.isArray(raw.data.address)
            ) {
                raw = raw.data.address
            }
            else if (raw.data.id != null || raw.data.phone != null) {
                raw = raw.data
            }
        }

        const a = camelKeys(raw || {}) as any
        const id = Number(a.id)

        // Street field: API column is "address" (string). Avoid nested object.
        let street = ''
        if (typeof a.address === 'string') {
            street = a.address
        }
        else if (a.addressLine != null) {
            street = String(a.addressLine)
        }
        else if (a.address_line != null) {
            street = String(a.address_line)
        }

        return {
            id: Number.isFinite(id) && id > 0 ? id : 0,
            title: String(a.title ?? ''),
            receiverName: String(a.receiverName ?? a.receiver_name ?? ''),
            phone: String(a.phone ?? ''),
            province: String(a.province ?? ''),
            city: String(a.city ?? ''),
            address: street,
            postalCode: String(a.postalCode ?? a.postal_code ?? ''),
            plaque: a.plaque != null && a.plaque !== '' ? String(a.plaque) : undefined,
            unit: a.unit != null && a.unit !== '' ? String(a.unit) : undefined,
            latitude: a.latitude != null ? Number(a.latitude) : undefined,
            longitude: a.longitude != null ? Number(a.longitude) : undefined,
            isDefault: Boolean(a.isDefault ?? a.is_default),
            createdAt: a.createdAt ?? a.created_at,
            updatedAt: a.updatedAt ?? a.updated_at,
        }
    }

    const fetchAddresses = async (force = false) => {
        if (isLoaded.value && !force) {
            return
        }

        pending.value = true
        error.value = ''

        try {
            const response = await apiFetch<any>('/addresses')
            const list = Array.isArray(response?.addresses)
                ? response.addresses
                : (Array.isArray(response) ? response : [])

            items.value = list
                .map((a: any) => extractAddress(a))
                .filter((a: Address) => a.id > 0)

            sortAddresses()
            isLoaded.value = true
        }
        catch (err: unknown) {
            console.error('Fetch addresses error:', err)
            // Do not wipe existing items on transient failure
            error.value = extractErrorMessage(
                err,
                'دریافت آدرس‌ها با خطا مواجه شد.',
            )
        }
        finally {
            pending.value = false
        }
    }

    const createAddress = async (
        payload: CreateAddressPayload,
    ) => {
        submitting.value = true
        actionError.value = ''

        try {
            const body = snakeKeys({
                ...payload,
                phone: normalizePhone(payload.phone),
                postalCode: String(payload.postalCode || '').replace(/\D/g, ''),
            })

            const response = await apiFetch<any>(
                '/addresses',
                {
                    method: 'POST',
                    body,
                },
            )

            const address = extractAddress(response)
            if (!address.id) {
                // Reload list if parse failed but create likely succeeded
                isLoaded.value = false
                await fetchAddresses(true)
                const last = items.value[0] || null
                return last
            }

            if (address.isDefault) {
                items.value.forEach((item) => {
                    item.isDefault = false
                })
            }

            // Avoid duplicates
            items.value = items.value.filter(i => i.id !== address.id)
            items.value.unshift(address)
            sortAddresses()
            isLoaded.value = true

            return address
        }
        catch (err: unknown) {
            console.error('Create address error:', err)

            actionError.value = extractErrorMessage(
                err,
                'ثبت آدرس با خطا مواجه شد.',
            )

            return null
        }
        finally {
            submitting.value = false
        }
    }

    const updateAddress = async (
        id: number,
        payload: UpdateAddressPayload,
    ) => {
        submitting.value = true
        actionError.value = ''

        try {
            const previous = items.value.find(item => item.id === id) ?? null

            const normalized: any = { ...payload }
            // Never send id as body field
            delete normalized.id
            if (payload.phone) {
                normalized.phone = normalizePhone(payload.phone)
            }
            if (payload.postalCode) {
                normalized.postalCode = String(payload.postalCode).replace(/\D/g, '')
            }

            const response = await apiFetch<any>(
                `/addresses/${id}`,
                {
                    method: 'PUT',
                    body: snakeKeys(normalized),
                },
            )

            let address = extractAddress(response)

            // If response parse failed, merge payload onto previous so UI still updates
            if (!address.id || address.id !== id) {
                address = extractAddress({
                    ...(previous || {}),
                    ...normalized,
                    id,
                    isDefault: previous?.isDefault ?? false,
                    is_default: previous?.isDefault ?? false,
                })
                // Prefer server list as source of truth
                await fetchAddresses(true)
                const refreshed = items.value.find(item => item.id === id)
                if (refreshed) {
                    return refreshed
                }
            }

            if (address.isDefault) {
                items.value.forEach((item) => {
                    item.isDefault = item.id === id
                })
            }

            const addressIndex = items.value.findIndex(
                item => item.id === id,
            )

            if (addressIndex !== -1) {
                // Replace with a new object so Vue reactivity always picks it up
                items.value.splice(addressIndex, 1, { ...address, id })
            }
            else {
                items.value.unshift({ ...address, id })
            }

            sortAddresses()

            return items.value.find(item => item.id === id) ?? address
        }
        catch (err: unknown) {
            console.error('Update address error:', err)

            actionError.value = extractErrorMessage(
                err,
                'ویرایش آدرس با خطا مواجه شد.',
            )

            return null
        }
        finally {
            submitting.value = false
        }
    }

    const deleteAddress = async (id: number) => {
        submitting.value = true
        actionError.value = ''

        try {
            await apiFetch(`/addresses/${id}`, {
                method: 'DELETE',
            })

            items.value = items.value.filter(
                item => item.id !== id,
            )

            return true
        }
        catch (err: unknown) {
            console.error('Delete address error:', err)

            actionError.value = extractErrorMessage(
                err,
                'حذف آدرس با خطا مواجه شد.',
            )

            return null
        }
        finally {
            submitting.value = false
        }
    }

    const setDefaultAddress = async (id: number) => {
        submitting.value = true
        actionError.value = ''

        try {
            const response = await apiFetch<any>(
                `/addresses/${id}/default`,
                {
                    method: 'PUT',
                },
            )

            items.value.forEach((item) => {
                item.isDefault = item.id === id
            })

            sortAddresses()

            return extractAddress(response)
        }
        catch (err: unknown) {
            console.error('Set default address error:', err)

            actionError.value = extractErrorMessage(
                err,
                'تغییر آدرس پیش‌فرض با خطا مواجه شد.',
            )

            return null
        }
        finally {
            submitting.value = false
        }
    }

    const clearActionError = () => {
        actionError.value = ''
    }

    return {
        items,
        pending,
        submitting,
        error,
        actionError,
        isLoaded,
        totalItems,
        defaultAddress,
        getAddressById,
        fetchAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        clearActionError,
    }
})
