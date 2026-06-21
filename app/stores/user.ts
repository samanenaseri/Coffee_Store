import { defineStore } from "pinia"
import type { Address } from "#shared/address"
import { mockAddresses } from "#server/mock/addresses"

interface UserProfile {
    isGuest: boolean
    name: string
    phone: string
    email: string
    birthDate: string
}

export const useUserStore = defineStore("user", () => {
    const user = ref<UserProfile>({
        isGuest: true,
        name: "",
        phone: "",
        email: "",
        birthDate: "",
    })

    const addresses = ref<Address[]>([...mockAddresses])

    const selectedAddressId = ref<number | null>(
        addresses.value.find(address => address.isDefault)?.id ?? null,
    )

    const selectedAddress = computed(() => {
        return addresses.value.find(
            address => address.id === selectedAddressId.value,
        )
    })

    const setUser = (data: Partial<UserProfile>) => {
        user.value = {
            ...user.value,
            ...data,
        }

        saveUser()
    }

    const addAddress = (address: Omit<Address, "id">) => {
        addresses.value.push({
            id: Date.now(),
            ...address,
        })

        saveUser()
    }

    const selectAddress = (id: number) => {
        selectedAddressId.value = id
        saveUser()
    }

    const saveUser = () => {
        if (!import.meta.client) return

        localStorage.setItem(
            "coffee-user",
            JSON.stringify({
                user: user.value,
                addresses: addresses.value,
                selectedAddressId: selectedAddressId.value,
            }),
        )
    }

    const loadUser = () => {
        if (!import.meta.client) return

        try {
            const savedData = localStorage.getItem("coffee-user")

            if (!savedData) return

            const parsedData = JSON.parse(savedData)

            if (parsedData.user) {
                user.value = {
                    ...user.value,
                    ...parsedData.user,
                }
            }

            if (Array.isArray(parsedData.addresses)) {
                addresses.value = parsedData.addresses
            }

            if (
                typeof parsedData.selectedAddressId === "number" ||
                parsedData.selectedAddressId === null
            ) {
                selectedAddressId.value = parsedData.selectedAddressId
            }
        } catch {
            localStorage.removeItem("coffee-user")
        }
    }

    const resetUser = () => {
        user.value = {
            isGuest: true,
            name: "",
            phone: "",
            email: "",
            birthDate: "",
        }

        selectedAddressId.value = null

        if (import.meta.client) {
            localStorage.removeItem("coffee-user")
        }
    }

    return {
        user,
        addresses,
        selectedAddressId,
        selectedAddress,
        setUser,
        addAddress,
        selectAddress,
        saveUser,
        loadUser,
        resetUser,
    }
})