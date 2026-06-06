import { mockTestimonials } from "#server/mock/testimonials"

export default defineEventHandler(() => {
    const testimonials = mockTestimonials
        .filter((testimonial) => testimonial.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)

    return {
        success: true,
        data: testimonials,
    }
})