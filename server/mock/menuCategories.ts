import type { MenuCategory } from '#shared/menu'

export const mockMenuCategories: MenuCategory[] = [
    {
        id: 1,
        title: 'قهوه',
        slug: 'coffee',
        description: 'انواع قهوه‌های کلاسیک و تخصصی',
        icon: 'coffee',
        sortOrder: 1,
        isActive: true,
        items: [
            {
                id: 1,
                title: 'اسپرسو',
                description: 'قهوه‌ای غلیظ و کلاسیک با عطر قوی',
                price: 85000,
                isAvailable: true,
                isPopular: true
            },
            {
                id: 2,
                title: 'آمریکانو',
                description: 'اسپرسو رقیق‌شده با آب داغ',
                price: 90000,
                isAvailable: true
            },
            {
                id: 3,
                title: 'لاته',
                description: 'ترکیب اسپرسو با شیر بخار داده‌شده',
                price: 120000,
                isAvailable: true,
                isPopular: true
            }
        ]
    },
    {
        id: 2,
        title: 'نوشیدنی گرم',
        slug: 'hot-drinks',
        description: 'نوشیدنی‌های گرم و دلچسب برای روزهای آرام',
        icon: 'hotDrink',
        sortOrder: 2,
        isActive: true,
        items: [
            {
                id: 4,
                title: 'هات چاکلت',
                description: 'شکلات داغ با بافتی نرم و طعم دلنشین',
                price: 95000,
                isAvailable: true
            },
            {
                id: 5,
                title: 'چای ماسالا',
                description: 'چای ادویه‌دار با شیر و رایحه گرم',
                price: 90000,
                isAvailable: true
            }
        ]
    },
    {
        id: 3,
        title: 'نوشیدنی سرد',
        slug: 'cold-drinks',
        description: 'نوشیدنی‌های خنک و تازه',
        icon: 'coldDrink',
        sortOrder: 3,
        isActive: true,
        items: [
            {
                id: 6,
                title: 'آیس لاته',
                description: 'اسپرسو، شیر سرد و یخ',
                price: 125000,
                isAvailable: true,
                isPopular: true
            },
            {
                id: 7,
                title: 'لیموناد',
                description: 'نوشیدنی خنک با طعم لیموی تازه',
                price: 80000,
                isAvailable: false
            }
        ]
    },
    {
        id: 4,
        title: 'دمنوش',
        slug: 'herbal-tea',
        description: 'دمنوش‌های آرامش‌بخش و خوش‌عطر',
        icon: 'tea',
        sortOrder: 4,
        isActive: true,
        items: [
            {
                id: 8,
                title: 'دمنوش نعنا',
                description: 'دمنوشی سبک و خوش‌عطر',
                price: 70000,
                isAvailable: true
            },
            {
                id: 9,
                title: 'دمنوش به‌لیمو',
                description: 'دمنوشی آرامش‌بخش با رایحه ملایم',
                price: 75000,
                isAvailable: true
            }
        ]
    },
    {
        id: 5,
        title: 'کیک',
        slug: 'cake',
        description: 'کیک‌ها و دسرهای مناسب کنار قهوه',
        icon: 'cake',
        sortOrder: 5,
        isActive: true,
        items: [
            {
                id: 10,
                title: 'چیزکیک',
                description: 'چیزکیک خامه‌ای با بافت نرم',
                price: 140000,
                isAvailable: true,
                isPopular: true
            },
            {
                id: 11,
                title: 'براونی',
                description: 'کیک شکلاتی متراکم و خوش‌طعم',
                price: 110000,
                isAvailable: true
            }
        ]
    }
]