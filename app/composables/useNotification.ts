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

    const success = (title: string, message?: string) => {
        return addNotification({
            type: 'success',
            title,
            message,
        })
    }

    const error = (title: string, message?: string) => {
        return addNotification({
            type: 'error',
            title,
            message,
        })
    }

    const warning = (title: string, message?: string) => {
        return addNotification({
            type: 'warning',
            title,
            message,
        })
    }

    const info = (title: string, message?: string) => {
        return addNotification({
            type: 'info',
            title,
            message,
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