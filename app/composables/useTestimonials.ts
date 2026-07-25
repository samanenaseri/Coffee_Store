import type { Testimonial } from "#shared/testimonial"

export const useTestimonials = () => {
    const { apiFetch } = useApi()

    const { data, pending, error } = useAsyncData(
        "testimonials",
        () => apiFetch<Testimonial[]>('/testimonials'),
    )

    const testimonials = computed(() => data.value ?? [])

    return {
        testimonials,
        pending,
        error,
    }
}
