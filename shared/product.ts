export interface ProductCategory {
    id: number
    title: string
    slug: string
    meta_title?: string
    meta_description?: string
    og_title?: string
    og_description?: string
    og_image?: string
}

/** One sellable package size (e.g. 250g, 500g, 1kg) with its price in Rial */
export interface WeightPackage {
    id: string
    weight: number
    unit: 'g' | 'kg' | string
    price: number
}

export interface Product {
    id: number
    title: string
    slug: string
    price: number
    weight?: number | null
    weight_unit?: string
    weightUnit?: string
    price_per_kg?: number | null
    pricePerKg?: number | null
    weight_packages?: WeightPackage[] | null
    weightPackages?: WeightPackage[] | null
    image: string
    image_alt?: string
    imageAlt?: string
    category: ProductCategory
    description: string
    rating: number
    inventory: number
    is_active?: boolean
    sort_order?: number
    isFavorite?: boolean
    meta_title?: string
    meta_description?: string
    og_title?: string
    og_description?: string
    og_image?: string
}

export function getProductWeightPackages(product: Product): WeightPackage[] {
    const packages = product.weightPackages ?? product.weight_packages
    if (Array.isArray(packages) && packages.length > 0) {
        return packages
    }
    return []
}

export function formatWeightLabel(weight: number, unit?: string | null): string {
    const u = unit === 'kg' ? 'کیلوگرم' : 'گرم'
    return `${weight} ${u}`
}
