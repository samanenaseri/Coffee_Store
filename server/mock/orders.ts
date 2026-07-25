import type { Order } from '#shared/order'

export const mockOrders: Order[] = [

    {
        id: 1001,
        date: '2026-06-16T09:00:00+03:30',
        status: 'processing',
        total: 900000,
        actionStatus: 'none',

        address: {
            receiverName: 'سامانه ناصری',
            phone: '09121234567',
            province: 'تهران',
            city: 'تهران',
            postalCode: '1234567890',
            address: 'تهران، خیابان ولیعصر، کوچه نمونه، پلاک ۱۲',
        },

        shipping: {
            method: 'ارسال با پست پیشتاز',
            cost: 80000,
            trackingCode: 'POST-1001-45892',
            estimatedDeliveryDate: '2026-06-19T18:00:00+03:30',
            deliveredAt: '2026-06-12T14:30:00+03:30',
        },

        payment: {
            method: 'online',
            status: 'pending',
        },
        walletAmount: 0,
        payableAmount: 900000,



        discountAmount: 50000,
        taxAmount: 0,
        description: 'لطفاً قهوه‌ها رو در بسته‌بندی محکم‌تر ارسال کنید.',
        items: [
            {
                productId: 1,
                quantity: 2,
                unitPrice: 350000,
            },
            {
                productId: 2,
                quantity: 1,
                unitPrice: 550000,
            },
        ],

        statusHistory: [
            {
                status: 'order_created',
                date: '2026-06-16T09:00:00+03:30',
                description: 'سفارش ثبت شد',
            },
            {
                status: 'processing',
                date: '2026-06-16T11:00:00+03:30',
                description: 'سفارش در حال آماده‌سازی است',
            },
        ],
    },

    {
        id: 1002,
        date: '2026-06-08',
        status: 'processing',
        total: 450000,

        address: {
            receiverName: 'سامانه ناصری',
            phone: '09121234567',
            province: 'تهران',
            city: 'تهران',
            postalCode: '1234567890',
            address: 'تهران، خیابان ولیعصر، کوچه نمونه، پلاک ۱۲',
        },

        shipping: {
            method: 'ارسال با پست پیشتاز',
            cost: 80000,
            trackingCode: 'POST-1001-45892',
            estimatedDeliveryDate: '2026-06-19T18:00:00+03:30',
            deliveredAt: '2026-06-12T14:30:00+03:30',
        },

        payment: {
            method: 'online',
            status: 'pending',
        },
        walletAmount: 0,
        payableAmount: 450000,
        discountAmount: 0,
        taxAmount: 0,
        description: '',
        items: [
            {
                productId: 3,
                quantity: 1,
                unitPrice: 450000,
            },
        ],
        statusHistory: [
            {
                status: 'pending',
                date: '2026-06-10T10:00:00+06:30',
                description: 'سفارش ثبت شد',
            },
            {
                status: 'processing',
                date: '2026-06-10T10:00:00+05:30',
                description: 'در حال آماده‌سازی',
            },
            {
                status: 'shipped',
                date: '2026-06-11T10:00:00+03:30',
                description: 'ارسال شد',
            },
            {
                status: 'cancel_requested',
                description: 'درخواست لغو ثبت شد',
                date: '2026-06-11T10:00:00+01:30',
            }
        ],
        actionStatus: 'none'
    },

    {
        id: 1003,
        date: '2026-06-10T09:00:00+03:30',
        status: 'delivered',
        actionStatus: 'none',
        total: 350000,

        address: {
            receiverName: 'سامانه ناصری',
            phone: '09121234567',
            province: 'تهران',
            city: 'تهران',
            postalCode: '1234567890',
            address: 'تهران، خیابان ولیعصر، کوچه نمونه، پلاک ۱۲',
        },

        shipping: {
            method: 'ارسال با پست پیشتاز',
            cost: 80000,
            trackingCode: 'POST-1001-45892',
            estimatedDeliveryDate: '2026-06-19T18:00:00+03:30',
            deliveredAt: '2026-06-12T14:30:00+03:30',
        },

        payment: {
            method: 'online',
            status: 'paid',
            transactionId: 'TRX-98273541',
            paidAt: '2026-06-16T09:05:00+03:30',
        },
        walletAmount: 0,
        payableAmount: 0,
        discountAmount: 350000,
        taxAmount: 0,
        description: 'اگه امکانش هست زودتر ارسال بشه.',
        items: [
            {
                productId: 1,
                quantity: 1,
                unitPrice: 350000,
            },
        ],

        statusHistory: [
            {
                status: 'order_created',
                date: '2026-06-10T09:00:00+03:30',
                description: 'سفارش ثبت شد',
            },
            {
                status: 'processing',
                date: '2026-06-10T12:00:00+03:30',
                description: 'سفارش آماده‌سازی شد',
            },
            {
                status: 'shipped',
                date: '2026-06-11T08:00:00+03:30',
                description: 'سفارش به شرکت حمل تحویل داده شد',
            },
            {
                status: 'delivered',
                date: '2026-06-12T14:00:00+03:30',
                description: 'سفارش به مشتری تحویل داده شد',
            },
        ],
    },
]