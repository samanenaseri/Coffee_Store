import type { Testimonial } from "#shared/testimonial"

export const mockTestimonials: Testimonial[] = [
    {
        id: 1,
        name: "مریم احمدی",
        role: "مشتری ثابت",
        comment: "کیفیت قهوه‌ها واقعاً عالیه. عطر و طعمش دقیقاً همون چیزیه که از یک فروشگاه تخصصی قهوه انتظار داشتم.",
        rating: 5,
        image: "/images/customer/customer1.png",
        isActive: true,
        sortOrder: 1,
    },
    {
        id: 2,
        name: "علی رضایی",
        role: "علاقه‌مند به قهوه",
        comment: "بسته‌بندی خیلی تمیز بود و قهوه تازه به دستم رسید. تجربه خرید خیلی خوبی داشتم.",
        rating: 5,
        image: "/images/customer/customer2.png",
        isActive: true,
        sortOrder: 2,
    },
    {
        id: 3,
        name: "سارا محمدی",
        role: "خریدار آنلاین",
        comment: "تنوع محصولات خوبه و توضیحات هر محصول کمک می‌کنه انتخاب راحت‌تری داشته باشم.",
        rating: 4,
        image: "/images/customer/customer3.png",
        isActive: true,
        sortOrder: 3,
    },
]