import type { Staff } from "#shared/staff"

export const mockStaffs: Staff[] = [
    {
        id: 1,
        name: "پویا احمدی",
        role: "باریستا ارشد",
        description: "متخصص تهیه اسپرسو، لاته‌آرت و نوشیدنی‌های بر پایه قهوه.",
        image: "/images/staff/staff-1.jpg",
        instagram: "maryam_coffee",
        sortOrder: 1,
        isActive: true,
    },
    {
        id: 2,
        name: "علی رضایی",
        role: "رستر قهوه",
        description: "مسئول انتخاب، رست و کنترل کیفیت دانه‌های قهوه.",
        image: "/images/staff/staff-2.jpg",
        instagram: "ali_roast",
        sortOrder: 2,
        isActive: true,
    },
    {
        id: 3,
        name: "سارا محمدی",
        role: "مشاور فروش",
        description: "راهنمای انتخاب قهوه مناسب بر اساس سلیقه مشتریان.",
        image: "/images/staff/staff-3.jpg",
        instagram: "sara.coffee",
        sortOrder: 3,
        isActive: true,
    },
    {
        id: 4,
        name: "رضا کریمی",
        role: "مدیر کافه",
        description: "هماهنگ‌کننده تیم، سفارش‌ها و تجربه مشتری در فروشگاه.",
        image: "/images/staff/staff-4.jpg",
        instagram: "reza.cafe",
        sortOrder: 4,
        isActive: true,
    },
]