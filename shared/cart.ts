import type { Product, WeightPackage } from "#shared/product"

export interface CartItem {
    product: Product
    quantity: number
    /** Selected package id when product has weight packages */
    weightPackageId?: string | null
    selectedWeight?: number | null
    selectedWeightUnit?: string | null
}

export function cartLineKey(item: Pick<CartItem, 'product' | 'weightPackageId'>): string {
    return `${item.product.id}:${item.weightPackageId ?? 'default'}`
}

export function cartLineKeyFromParts(productId: number, weightPackageId?: string | null): string {
    return `${productId}:${weightPackageId ?? 'default'}`
}

export function buildCartProduct(
    product: Product,
    pkg?: WeightPackage | null,
): Product {
    if (!pkg) {
        return { ...product }
    }

    return {
        ...product,
        price: pkg.price,
        weight: pkg.weight,
        weight_unit: pkg.unit,
        weightUnit: pkg.unit,
    }
}
