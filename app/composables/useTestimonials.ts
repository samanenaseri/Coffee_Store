// composables/useTestimonials.ts

import type { Testimonial } from "#shared/testimonial"

export const useTestimonials = () => {
    const { data, pending, error } = useAsyncData(
        "testimonials",
        () => $fetch<{ success: boolean; data: Testimonial[] }>("/api/testimonials")
    )

    const testimonials = computed(() => data.value?.data ?? [])

    return {
        testimonials,
        pending,
        error,
    }
}