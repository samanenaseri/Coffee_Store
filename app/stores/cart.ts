import { defineStore } from 'pinia'
import type { Product, WeightPackage } from '#shared/product'
import type { CartItem } from '#shared/cart'
import {
    buildCartProduct,
    cartLineKey,
    cartLineKeyFromParts,
} from '#shared/cart'

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])

    const totalItems = computed(() => {
        return items.value.reduce(
            (total, item) => total + item.quantity,
            0,
        )
    })

    const totalPrice = computed(() => {
        return items.value.reduce((total, item) => {
            return total + item.product.price * item.quantity
        }, 0)
    })

    const findLine = (productId: number, weightPackageId?: string | null) => {
        const key = cartLineKeyFromParts(productId, weightPackageId)
        return items.value.find(item => cartLineKey(item) === key)
    }

    const addToCart = (
        product: Product,
        pkg?: WeightPackage | null,
    ) => {
        addToCartWithQuantity(product, 1, pkg)
    }

    const addToCartWithQuantity = (
        product: Product,
        quantity: number,
        pkg?: WeightPackage | null,
    ) => {
        if (quantity <= 0) {
            return
        }

        const weightPackageId = pkg?.id ?? null
        const cartProduct = buildCartProduct(product, pkg)
        const existingItem = findLine(product.id, weightPackageId)

        if (existingItem) {
            existingItem.quantity += quantity
            existingItem.product = cartProduct
        }
        else {
            items.value.push({
                product: cartProduct,
                quantity,
                weightPackageId,
                selectedWeight: pkg?.weight ?? product.weight ?? null,
                selectedWeightUnit: pkg?.unit ?? product.weight_unit ?? product.weightUnit ?? null,
            })
        }

        saveCart()
    }

    const addMultipleToCart = (
        products: Array<{
            product: Product
            quantity: number
            weightPackage?: WeightPackage | null
        }>,
    ) => {
        products.forEach(({ product, quantity, weightPackage }) => {
            if (quantity <= 0) {
                return
            }
            addToCartWithQuantity(product, quantity, weightPackage)
        })
    }

    const increaseQuantity = (
        productId: number,
        weightPackageId?: string | null,
    ) => {
        const item = findLine(productId, weightPackageId)

        if (!item) {
            return
        }

        item.quantity += 1
        saveCart()
    }

    const decreaseQuantity = (
        productId: number,
        weightPackageId?: string | null,
    ) => {
        const item = findLine(productId, weightPackageId)

        if (!item) {
            return
        }

        if (item.quantity > 1) {
            item.quantity -= 1
        }
        else {
            removeFromCart(productId, weightPackageId)
            return
        }

        saveCart()
    }

    const removeFromCart = (
        productId: number,
        weightPackageId?: string | null,
    ) => {
        const key = cartLineKeyFromParts(productId, weightPackageId)
        items.value = items.value.filter(
            item => cartLineKey(item) !== key,
        )

        saveCart()
    }

    const clearCart = () => {
        items.value = []
        saveCart()
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price)
    }

    const saveCart = () => {
        if (!import.meta.client) {
            return
        }

        localStorage.setItem(
            'coffee-cart',
            JSON.stringify(items.value),
        )
    }

    const loadCart = () => {
        if (!import.meta.client) {
            return
        }

        try {
            const savedCart = localStorage.getItem('coffee-cart')

            if (savedCart) {
                const parsed = JSON.parse(savedCart) as CartItem[]
                items.value = parsed.map(item => ({
                    ...item,
                    weightPackageId: item.weightPackageId ?? null,
                    selectedWeight: item.selectedWeight ?? item.product?.weight ?? null,
                    selectedWeightUnit: item.selectedWeightUnit
                        ?? item.product?.weight_unit
                        ?? item.product?.weightUnit
                        ?? null,
                }))
            }
        }
        catch {
            items.value = []
        }
    }

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        addToCartWithQuantity,
        addMultipleToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        formatPrice,
        loadCart,
    }
})
