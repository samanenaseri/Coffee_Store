export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان"
}

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}