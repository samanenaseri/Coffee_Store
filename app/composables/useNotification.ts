export type NotificationType =
    | 'success'
    | 'error'
    | 'warning'
    | 'info'

export interface AppNotification {
    id: number
    type: NotificationType
    title: string
    message?: string
}

const notifications = ref<AppNotification[]>([])

export const useNotification = () => {
    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter(
            notification => notification.id !== id,
        )
    }

    const addNotification = (
        notification: Omit<AppNotification, 'id'>,
        duration = 5000,
    ) => {
        const id = Date.now() + Math.floor(Math.random() * 1000)

        notifications.value.push({
            id,
            ...notification,
        })

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }

        return id
    }

    /**
     * Normalize toast args.
     * Correct: success('متن') or success('عنوان', 'توضیح')
     * Also accepts mistaken object form: success({ title, message })
     */
    const normalizeToastArgs = (
        titleOrPayload: string | { title?: string; message?: string },
        message?: string,
    ): { title: string; message?: string } => {
        if (titleOrPayload && typeof titleOrPayload === 'object') {
            const title = String(titleOrPayload.title ?? '').trim()
            const msg = String(titleOrPayload.message ?? '').trim()
            // Prefer message-only display when both exist and user wants the body text
            if (msg && !title) return { title: msg }
            if (msg && title) return { title: msg }
            if (title) return { title }
            if (msg) return { title: msg }
            return { title: 'اعلان' }
        }

        const title = String(titleOrPayload ?? '').trim()
        const msg = message != null ? String(message).trim() : ''

        // Single-arg usage → show only that text
        if (!msg) return { title: title || 'اعلان' }

        // Two-arg: show message as main text (what user sees); keep title only if different
        // User preference: show message content. Use message as the visible line.
        return { title: msg }
    }

    const success = (
        titleOrPayload: string | { title?: string; message?: string },
        message?: string,
    ) => {
        const { title, message: msg } = normalizeToastArgs(titleOrPayload, message)
        return addNotification({
            type: 'success',
            title,
            message: msg,
        })
    }

    const error = (
        titleOrPayload: string | { title?: string; message?: string },
        message?: string,
    ) => {
        const { title, message: msg } = normalizeToastArgs(titleOrPayload, message)
        return addNotification({
            type: 'error',
            title,
            message: msg,
        })
    }

    const warning = (
        titleOrPayload: string | { title?: string; message?: string },
        message?: string,
    ) => {
        const { title, message: msg } = normalizeToastArgs(titleOrPayload, message)
        return addNotification({
            type: 'warning',
            title,
            message: msg,
        })
    }

    const info = (
        titleOrPayload: string | { title?: string; message?: string },
        message?: string,
    ) => {
        const { title, message: msg } = normalizeToastArgs(titleOrPayload, message)
        return addNotification({
            type: 'info',
            title,
            message: msg,
        })
    }

    return {
        notifications: readonly(notifications),
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
    }
}