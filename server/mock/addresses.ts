import type { Address } from "#shared/address"

export const mockAddresses: Address[] = [
    {
        id: 1,
        title: "خانه",
        city: "تهران",
        address: "خیابان ولیعصر، پلاک ۱۲۳",
        postalCode: "1234567890",
        isDefault: true,
    },
    {
        id: 2,
        title: "محل کار",
        city: "اصفهان",
        address: "خیابان چهارباغ، ساختمان سپهر",
        postalCode: "9876543210",
        isDefault: false,
    },
]