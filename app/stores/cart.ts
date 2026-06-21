import { defineStore } from 'pinia'
import type { Product } from '#shared/product'
import type { CartItem } from '#shared/cart'

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

    const addToCart = (product: Product) => {
        const existingItem = items.value.find(
            item => item.product.id === product.id,
        )

        if (existingItem) {
            existingItem.quantity += 1
        }
        else {
            items.value.push({
                product,
                quantity: 1,
            })
        }

        saveCart()
    }

    const addToCartWithQuantity = (
        product: Product,
        quantity: number,
    ) => {
        if (quantity <= 0) {
            return
        }

        const existingItem = items.value.find(
            item => item.product.id === product.id,
        )

        if (existingItem) {
            existingItem.quantity += quantity
        }
        else {
            items.value.push({
                product,
                quantity,
            })
        }

        saveCart()
    }

    const addMultipleToCart = (
        products: Array<{
            product: Product
            quantity: number
        }>,
    ) => {
        products.forEach(({ product, quantity }) => {
            if (quantity <= 0) {
                return
            }

            const existingItem = items.value.find(
                item => item.product.id === product.id,
            )

            if (existingItem) {
                existingItem.quantity += quantity
            }
            else {
                items.value.push({
                    product,
                    quantity,
                })
            }
        })

        saveCart()
    }

    const increaseQuantity = (productId: number) => {
        const item = items.value.find(
            item => item.product.id === productId,
        )

        if (!item) {
            return
        }

        item.quantity += 1
        saveCart()
    }

    const decreaseQuantity = (productId: number) => {
        const item = items.value.find(
            item => item.product.id === productId,
        )

        if (!item) {
            return
        }

        if (item.quantity > 1) {
            item.quantity -= 1
        }
        else {
            removeFromCart(productId)
            return
        }

        saveCart()
    }

    const removeFromCart = (productId: number) => {
        items.value = items.value.filter(
            item => item.product.id !== productId,
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
                items.value = JSON.parse(savedCart)
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