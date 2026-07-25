export interface Address {
    id: number
    title: string
    receiverName: string
    phone: string
    province: string
    city: string
    address: string
    postalCode: string
    plaque?: string
    unit?: string
    latitude?: number
    longitude?: number
    isDefault: boolean
    createdAt?: string
    updatedAt?: string
}

export interface CreateAddressPayload {
    title: string
    receiverName: string
    phone: string
    province: string
    city: string
    address: string
    postalCode: string
    plaque?: string
    unit?: string
    latitude?: number
    longitude?: number
    isDefault?: boolean
}

export type UpdateAddressPayload =
    Partial<CreateAddressPayload>