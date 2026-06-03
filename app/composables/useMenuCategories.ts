import type { MenuCategory } from "#shared/menu";

export const useMenuCategories = () => {
    const { data, pending, error } = useAsyncData(
        "menu-categories",
        () => $fetch<{ success: boolean; data: MenuCategory[] }>("/api/menu-categories")
    );

    const menuCategories = computed(() => data.value?.data ?? []);

    const activeCategorySlug = ref<string>("");

    watchEffect(() => {
        if (!activeCategorySlug.value && menuCategories.value.length > 0) {
            activeCategorySlug.value = menuCategories.value[0]?.slug ?? "";
        }
    });

    const activeCategory = computed<MenuCategory | undefined>(() => {
        return menuCategories.value.find(
            (category) => category.slug === activeCategorySlug.value
        );
    });

    const setActiveCategory = (slug: string) => {
        activeCategorySlug.value = slug;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    return {
        menuCategories,
        activeCategorySlug,
        activeCategory,
        setActiveCategory,
        formatPrice,
        pending,
        error,
    };
};