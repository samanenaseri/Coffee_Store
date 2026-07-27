# پنل مدیریت CMS - مستندات فنی

## ۱. نمای کلی

پنل مدیریت یک اپلیکیشن Vue 3 مستقل است که از طریق API با بک‌اند Laravel ارتباط برقرار می‌کند.

### معماری

```
┌─────────────────────────────────────────┐
│           Admin Panel (Vue 3)            │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │ Composables│ │ Stores │  │
│  └────┬────┘  └─────┬────┘  └───┬────┘  │
│       └──────────────┼──────────┘        │
│                      │                   │
│              useAdminApi()               │
│                      │                   │
└──────────────────────┼───────────────────┘
                       │ HTTP (JWT Bearer)
                       ▼
┌──────────────────────────────────────────┐
│        Laravel API (backend/)             │
│  ┌──────────────────────────────────┐    │
│  │  /api/v1/admin/*  routes          │    │
│  │  auth:api + is_admin middleware    │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### فناوری‌ها

| لایه | فناوری | نسخه |
|------|--------|------|
| Framework | Vue 3 | 3.4+ |
| Build Tool | Vite | 5+ |
| State Management | Pinia | 2+ |
| Router | Vue Router 4 | 4+ |
| HTTP Client | Axios | 1+ |
| UI Framework | Tailwind CSS | 3.4+ |
| Charts | Chart.js | 4+ |
| Icons | Remix Icon | - |
| Tables | دستی با Tailwind | - |
| Forms | دستی با Tailwind | - |

---

## ۲. ساختار پوشه‌ها

```
admin/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminSidebar.vue
│   │   │   ├── AdminHeader.vue
│   │   │   └── AdminLayout.vue
│   │   ├── ui/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseTable.vue
│   │   │   ├── BasePagination.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseAlert.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseTextarea.vue
│   │   │   ├── BaseToggle.vue
│   │   │   ├── BaseCard.vue
│   │   │   └── ImageUpload.vue
│   │   ├── dashboard/
│   │   │   ├── StatsCard.vue
│   │   │   └── RevenueChart.vue
│   │   ├── products/
│   │   │   ├── ProductForm.vue
│   │   │   └── ProductTable.vue
│   │   ├── categories/
│   │   │   ├── CategoryForm.vue
│   │   │   └── CategoryTable.vue
│   │   ├── menu/
│   │   │   ├── MenuCategoryForm.vue
│   │   │   ├── MenuItemForm.vue
│   │   │   └── MenuTable.vue
│   │   ├── orders/
│   │   │   ├── OrderTable.vue
│   │   │   ├── OrderDetail.vue
│   │   │   └── OrderStatusBadge.vue
│   │   ├── articles/
│   │   │   ├── ArticleForm.vue
│   │   │   └── ArticleTable.vue
│   │   ├── gallery/
│   │   │   ├── GalleryForm.vue
│   │   │   └── GalleryTable.vue
│   │   ├── staff/
│   │   │   ├── StaffForm.vue
│   │   │   └── StaffTable.vue
│   │   ├── testimonials/
│   │   │   ├── TestimonialForm.vue
│   │   │   └── TestimonialTable.vue
│   │   ├── users/
│   │   │   ├── UserTable.vue
│   │   │   └── UserDetail.vue
│   │   ├── support/
│   │   │   ├── TicketTable.vue
│   │   │   ├── TicketDetail.vue
│   │   │   └── TicketReply.vue
│   │   └── settings/
│   │       └── SettingsForm.vue
│   ├── composables/
│   │   ├── useAdminApi.ts
│   │   ├── useAdminAuth.ts
│   │   ├── usePagination.ts
│   │   └── useConfirm.ts
│   ├── pages/
│   │   ├── LoginPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── products/
│   │   │   ├── ProductsPage.vue
│   │   │   └── ProductEditPage.vue
│   │   ├── categories/
│   │   │   ├── CategoriesPage.vue
│   │   │   └── CategoryEditPage.vue
│   │   ├── menu/
│   │   │   ├── MenuCategoriesPage.vue
│   │   │   ├── MenuCategoryEditPage.vue
│   │   │   ├── MenuItemsPage.vue
│   │   │   └── MenuItemEditPage.vue
│   │   ├── orders/
│   │   │   ├── OrdersPage.vue
│   │   │   └── OrderDetailPage.vue
│   │   ├── articles/
│   │   │   ├── ArticlesPage.vue
│   │   │   └── ArticleEditPage.vue
│   │   ├── gallery/
│   │   │   ├── GalleryPage.vue
│   │   │   └── GalleryEditPage.vue
│   │   ├── staff/
│   │   │   ├── StaffPage.vue
│   │   │   └── StaffEditPage.vue
│   │   ├── testimonials/
│   │   │   ├── TestimonialsPage.vue
│   │   │   └── TestimonialEditPage.vue
│   │   ├── users/
│   │   │   ├── UsersPage.vue
│   │   │   └── UserDetailPage.vue
│   │   ├── support/
│   │   │   ├── SupportPage.vue
│   │   │   └── TicketDetailPage.vue
│   │   └── settings/
│   │       └── SettingsPage.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── menu.ts
│   │   ├── orders.ts
│   │   ├── articles.ts
│   │   ├── gallery.ts
│   │   ├── staff.ts
│   │   ├── testimonials.ts
│   │   ├── users.ts
│   │   ├── support.ts
│   │   └── settings.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## ۳. API Endpoints مرجع

### احراز هویت

| method | endpoint | description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | ورود (هم برای ادمین و کاربر عادی) |

### داشبورد

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | آمار کلی + درآمد ماهانه |

**پاسخ:**
```json
{
  "total_users": 150,
  "total_orders": 320,
  "total_products": 45,
  "total_revenue": 125000000,
  "recent_orders": [...],
  "monthly_revenue": [
    { "month": "2026-01", "revenue": 8500000 },
    ...
  ]
}
```

### محصولات (Products)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/products` | لیست محصولات (search, filter by category_id) |
| POST | `/api/v1/admin/products` | ایجاد محصول |
| GET | `/api/v1/admin/products/{id}` | جزئیات محصول |
| PUT | `/api/v1/admin/products/{id}` | ویرایش محصول |
| DELETE | `/api/v1/admin/products/{id}` | حذف محصول |

**فیلدها:**
```json
{
  "title": "string (required|max:255)",
  "slug": "string (required|unique)",
  "price": "integer (required|min:0)",
  "image": "string|nullable",
  "category_id": "integer|exists:categories,id",
  "description": "text|nullable",
  "rating": "numeric|nullable|0-5",
  "inventory": "integer|nullable|min:0",
  "is_active": "boolean|default:true",
  "sort_order": "integer|default:0"
}
```

### دسته‌بندی محصولات (Categories)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/categories` | لیست (با products_count) |
| POST | `/api/v1/admin/categories` | ایجاد |
| GET | `/api/v1/admin/categories/{id}` | جزئیات |
| PUT | `/api/v1/admin/categories/{id}` | ویرایش |
| DELETE | `/api/v1/admin/categories/{id}` | حذف (امکان‌پذیر نیست اگر محصول داشته باشد) |

**فیلدها:**
```json
{
  "title": "string (required|max:255)",
  "slug": "string (required|unique)",
  "description": "text|nullable",
  "icon": "string|nullable|max:255",
  "image": "string|nullable|max:255",
  "sort_order": "integer|default:0",
  "is_active": "boolean|default:true"
}
```

### دسته‌بندی منو (Menu Categories)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/menu-categories` | لیست (با items_count) |
| POST | `/api/v1/admin/menu-categories` | ایجاد |
| GET | `/api/v1/admin/menu-categories/{id}` | جزئیات |
| PUT | `/api/v1/admin/menu-categories/{id}` | ویرایش |
| DELETE | `/api/v1/admin/menu-categories/{id}` | حذف (امکان‌پذیر نیست اگر آیتم داشته باشد) |

### آیتم‌های منو (Menu Items)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/menu-items` | لیست (search, filter by category_id) |
| POST | `/api/v1/admin/menu-items` | ایجاد |
| GET | `/api/v1/admin/menu-items/{id}` | جزئیات |
| PUT | `/api/v1/admin/menu-items/{id}` | ویرایش |
| DELETE | `/api/v1/admin/menu-items/{id}` | حذف |

**فیلدها:**
```json
{
  "category_id": "integer (required|exists:menu_categories,id)",
  "title": "string (required|max:255)",
  "description": "text|nullable",
  "price": "integer (required|min:0)",
  "is_available": "boolean|default:true",
  "is_popular": "boolean|default:false",
  "image": "string|nullable|max:255",
  "sort_order": "integer|default:0"
}
```

### سفارشات (Orders)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/orders` | لیست سفارشات (filter: status, search: tracking_code/email) |
| GET | `/api/v1/admin/orders/{id}` | جزئیات سفارش (با items, user, statusHistory) |
| PUT | `/api/v1/admin/orders/{id}/status` | تغییر وضعیت |
| PUT | `/api/v1/admin/orders/{id}/action-status` | تغییر action_status |
| PUT | `/api/v1/admin/orders/{id}/tracking-code` | بروزرسانی کد رهگیری |

**وضعیت‌های سفارش:**
```
pending → processing → shipped → delivered
                                    ↘ cancelled
                                    ↘ returned
```

**فیلد وضعیت:**
```json
{
  "status": "string (required|in:pending,processing,shipped,delivered,cancelled,returned)"
}
```

### مقالات (Articles)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/articles` | لیست (مرتب‌شده بر اساس sort_order) |
| POST | `/api/v1/admin/articles` | ایجاد |
| GET | `/api/v1/admin/articles/{id}` | جزئیات |
| PUT | `/api/v1/admin/articles/{id}` | ویرایش |
| DELETE | `/api/v1/admin/articles/{id}` | حذف |

**فیلدها:**
```json
{
  "title": "string (required|max:255)",
  "slug": "string (required|unique)",
  "description": "text|nullable",
  "content": "text|nullable",
  "image": "string|nullable|max:500",
  "image_alt": "string|nullable|max:255",
  "author": "string|nullable|max:255",
  "is_active": "boolean|default:true",
  "sort_order": "integer|default:0"
}
```

### گالری (Gallery)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/gallery` | لیست |
| POST | `/api/v1/admin/gallery` | ایجاد |
| GET | `/api/v1/admin/gallery/{id}` | جزئیات |
| PUT | `/api/v1/admin/gallery/{id}` | ویرایش |
| DELETE | `/api/v1/admin/gallery/{id}` | حذف |

**فیلدها:**
```json
{
  "title": "string (required|max:255)",
  "slug": "string (required|unique)",
  "image": "string (required|max:500)",
  "image_alt": "string|nullable|max:255",
  "category": "string|nullable|max:255",
  "description": "text|nullable",
  "sort_order": "integer|default:0",
  "is_active": "boolean|default:true"
}
```

### کارکنان (Staff)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/staff` | لیست |
| POST | `/api/v1/admin/staff` | ایجاد |
| GET | `/api/v1/admin/staff/{id}` | جزئیات |
| PUT | `/api/v1/admin/staff/{id}` | ویرایش |
| DELETE | `/api/v1/admin/staff/{id}` | حذف |

**فیلدها:**
```json
{
  "name": "string (required|max:255)",
  "role": "string (required|max:255)",
  "description": "text|nullable",
  "image": "string|nullable|max:255",
  "instagram": "string|nullable|max:255",
  "sort_order": "integer|default:0",
  "is_active": "boolean|default:true"
}
```

### نظرات مشتریان (Testimonials)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/testimonials` | لیست |
| POST | `/api/v1/admin/testimonials` | ایجاد |
| GET | `/api/v1/admin/testimonials/{id}` | جزئیات |
| PUT | `/api/v1/admin/testimonials/{id}` | ویرایش |
| DELETE | `/api/v1/admin/testimonials/{id}` | حذف |

**فیلدها:**
```json
{
  "name": "string (required|max:255)",
  "role": "string|nullable|max:255",
  "comment": "text (required)",
  "rating": "integer (required|min:1|max:5)",
  "image": "string|nullable|max:255",
  "is_active": "boolean|default:true",
  "sort_order": "integer|default:0"
}
```

### کاربران (Users)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | لیست (search: name/email, با orders_count) |
| GET | `/api/v1/admin/users/{id}` | جزئیات (با orders, wallet) |
| PUT | `/api/v1/admin/users/{id}` | بروزرسانی (name, email, phone, is_admin) |

### پشتیبانی (Support)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/support` | لیست تیکت‌ها (filter: status, با user) |
| GET | `/api/v1/admin/support/{id}` | جزئیات تیکت (با replies, user) |
| POST | `/api/v1/admin/support/{id}/reply` | پاسخ ادمین |
| PUT | `/api/v1/admin/support/{id}/status` | تغییر وضعیت |

**فیلد پاسخ:**
```json
{
  "message": "string (required)"
}
```

### تنظیمات (Settings)

| method | endpoint | description |
|--------|----------|-------------|
| GET | `/api/v1/admin/settings` | دریافت تمام تنظیمات |
| PUT | `/api/v1/admin/settings` | بروزرسانی دسته‌ای |

---

## ۴. احراز هویت ادمین

### نحوه ورود

ادمین از همان endpoint ورود کاربران عادی استفاده می‌کند:

```typescript
// POST /api/v1/auth/login
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
// response: { user: { ..., is_admin: true }, token: "..." }
```

### بررسی دسترسی ادمین

after login, check `user.is_admin`:

```typescript
if (!response.user.is_admin) {
  // redirect to main site or show error
}
```

### ارسال درخواست‌ها

```typescript
// هر درخواست API باید شامل Authorization header باشد:
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

### خروج

```typescript
// POST /api/v1/auth/logout
await fetch('/api/v1/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
})
// remove token from localStorage
```

---

## ۵. صفحات پنل ادمین

### ۵.۱ صفحه ورود (`/login`)

- فرم ورود با ایمیل و رمز عبور
- بعد از ورود موفق، بررسی `is_admin`
- اگر ادمین نباشد، پیام خطا نمایش داده می‌شود
- ذخیره توکن در `localStorage`

### ۵.۲ داشبورد (`/`)

آمار کلی:
- تعداد کل کاربران
- تعداد کل سفارشات
- تعداد کل محصولات
- مجموع درآمد
- نمودار درآمد ماهانه (۱۲ ماه اخیر)
- ۱۰ سفارش اخیر

### ۵.۳ مدیریت محصولات

#### لیست محصولات (`/products`)
- جدول با ستون‌های: عنوان, قیمت, دسته‌بندی, موجودی, وضعیت, عملیات
- جستجو عنوان
- فیلتر دسته‌بندی
- صفحه‌بندی
- دکمه افزودن محصول جدید

#### فرم محصول (`/products/new`, `/products/:id/edit`)
- عنوان (required)
- slug (auto-generate from title, قابل ویرایش)
- قیمت (ریال)
- تصویر (URL یا آپلود)
- دسته‌بندی (select از categories)
- توضیحات (textarea)
- امتیاز (0-5)
- موجودی
- فعال/غیرفعال (toggle)
- ترتیب نمایش

### ۵.۴ مدیریت دسته‌بندی‌ها

#### لیست (`/categories`)
- جدول: عنوان, slug, تعداد محصولات, وضعیت, عملیات
- دکمه افزودن

#### فرم (`/categories/new`, `/categories/:id/edit`)
- عنوان, slug, توضیحات, آیکون, تصویر, ترتیب, فعال/غیرفعال
- ⚠️ حذف فقط در صورتی که محصولی به این دسته وصل نباشد

### ۵.۵ مدیریت منوی کafe

#### دسته‌بندی منو (`/menu-categories`)
- CRUD کامل
- فیلدها: عنوان, slug, توضیحات, آیکون, ترتیب, فعال

#### آیتم‌های منو (`/menu-items`)
- CRUD کامل
- فیلدها: دسته‌بندی, عنوان, توضیحات, قیمت, موجود, محبوب, تصویر, ترتیب

### ۵.۶ مدیریت سفارشات

#### لیست سفارشات (`/orders`)
- جدول: شماره سفارش, کاربر, مبلغ, وضعیت, تاریخ, عملیات
- فیلتر وضعیت (dropdown)
- جستجو (شماره پیگیری یا ایمیل کاربر)
- صفحه‌بندی

#### جزئیات سفارش (`/orders/:id`)
- اطلاعات کاربر
- لیست اقلام سفارش
- آدرس تحویل
- روش ارسال و پرداخت
- **تاریخچه وضعیت** (Status History)
- **تغییر وضعیت** (dropdown + دکمه)
- **کد رهگیری پستی** (input + دکمه ذخیره)

### ۵.۷ مدیریت مقالات

#### لیست (`/articles`)
- جدول: عنوان, نویسنده, وضعیت, تاریخ, عملیات

#### فرم (`/articles/new`, `/articles/:id/edit`)
- عنوان, slug, توضیحات, محتوا (textarea), تصویر, alt تصویر, نویسنده, فعال, ترتیب

### ۵.۸ مدیریت گالری

#### لیست (`/gallery`)
- جدول: عنوان, دسته‌بندی, وضعیت, عملیات

#### فرم (`/gallery/new`, `/gallery/:id/edit`)
- عنوان, slug, تصویر (required), alt, دسته‌بندی, توضیحات, ترتیب, فعال

### ۵.۹ مدیریت کارکنان

#### لیست (`/staff`)
- جدول: نام, نقش, وضعیت, عملیات

#### فرم (`/staff/new`, `/staff/:id/edit`)
- نام, نقش, توضیحات, تصویر, اینستاگرام, ترتیب, فعال

### ۵.۱۰ مدیریت نظرات مشتریان

#### لیست (`/testimonials`)
- جدول: نام, امتیاز, وضعیت, عملیات

#### فرم (`/testimonials/new`, `/testimonials/:id/edit`)
- نام, نقش, نظر, امتیاز (1-5), تصویر, فعال, ترتیب

### ۵.۱۱ مدیریت کاربران

#### لیست (`/users`)
- جدول: نام, ایمیل, تلفن, تعداد سفارشات, نقش, عملیات
- جستجو (نام/ایمیل)

#### جزئیات (`/users/:id`)
- اطلاعات کاربر
- تعداد سفارشات
- موجودی کیف پول
- **تغییر نقش** (ادمین/کاربر عادی)
- **ویرایش نام و ایمیل**

### ۵.۱۲ مدیریت پشتیبانی

#### لیست تیکت‌ها (`/support`)
- جدول: شماره, کاربر, موضوع, وضعیت, اولویت, تاریخ, عملیات
- فیلتر وضعیت

#### جزئیات تیکت (`/support/:id`)
- اطلاعات تیکت
- لیست پیام‌ها (کاربر + ادمین)
- **فرم پاسخ** (textarea + دکمه ارسال)
- **تغییر وضعیت** دستی

### ۵.۱۳ تنظیمات (`/settings`)
- فرم key-value
- تنظیمات عمومی سایت (نام سایت, توضیحات, اطلاعات تماس, شبکه‌های اجتماعی)
- ذخیره دسته‌ای

---

## ۶. کامپوننت‌های UI مشترک

### BaseTable
```vue
<BaseTable
  :columns="[
    { key: 'title', label: 'عنوان', sortable: true },
    { key: 'price', label: 'قیمت', format: 'currency' },
    { key: 'status', label: 'وضعیت', slot: 'status' },
  ]"
  :data="items"
  :loading="pending"
  @sort="handleSort"
>
  <template #status="{ item }">
    <BaseBadge :variant="item.is_active ? 'success' : 'danger'">
      {{ item.is_active ? 'فعال' : 'غیرفعال' }}
    </BaseBadge>
  </template>
</BaseTable>
```

### BasePagination
```vue
<BasePagination
  :current-page="currentPage"
  :total-pages="totalPages"
  @page-change="goToPage"
/>
```

### BaseModal
```vue
<BaseModal v-model="isOpen" title="عنوان مودال">
  <template #body>محتوا</template>
  <template #footer>
    <BaseButton @click="isOpen = false">بستن</BaseButton>
  </template>
</BaseModal>
```

### ImageUpload
```vue
<ImageUpload
  v-model="imageUrl"
  :accept="'image/*'"
  @uploaded="handleUpload"
/>
```

---

## ۷. قوانین فرم‌ها

### اعتبارسنجی سمت کلاینت

| فیلد | قوانین |
|------|--------|
| title | required, max 255 |
| slug | required, unique (except current), slug format |
| price | required, integer, min 0 |
| description | optional, text |
| image | optional (required for gallery), URL string |
| category_id | required, exists in categories |
| sort_order | integer, min 0 |
| is_active | boolean |
| rating | numeric, 0-5 |
| inventory | integer, min 0 |

### نمایش خطاها

خطاهای validation از سرور با فرمت زیر برمی‌گردند:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "slug": ["The slug has already been taken."]
  }
}
```

نحوه نمایش:
```typescript
// در فرم، خطاها را نمایش بده زیر هر فیلد
Object.entries(errors).forEach(([field, messages]) => {
  // نمایش messages[0] زیر فیلد مربوطه
})
```

---

## ۸. مدیریت وضعیت (State Management)

### الگوی هر store

```typescript
// stores/products.ts
export const useProductsStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const currentItem = ref<Product | null>(null)
  const pending = ref(false)
  const error = ref('')
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 })

  const fetchItems = async (params?: { search?: string; category_id?: number; page?: number }) => { ... }
  const fetchItem = async (id: number) => { ... }
  const createItem = async (data: ProductPayload) => { ... }
  const updateItem = async (id: number, data: ProductPayload) => { ... }
  const deleteItem = async (id: number) => { ... }

  return { items, currentItem, pending, error, pagination, fetchItems, fetchItem, createItem, updateItem, deleteItem }
})
```

---

## ۹. مسیریابی (Routing)

```typescript
const routes = [
  // صفحه ورود
  { path: '/login', name: 'login', component: LoginPage, meta: { guest: true } },

  // صفحات ادمین (نیاز به احراز هویت)
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardPage },
      // محصولات
      { path: 'products', name: 'products', component: ProductsPage },
      { path: 'products/new', name: 'products-create', component: ProductEditPage },
      { path: 'products/:id/edit', name: 'products-edit', component: ProductEditPage },
      // دسته‌بندی‌ها
      { path: 'categories', name: 'categories', component: CategoriesPage },
      { path: 'categories/new', name: 'categories-create', component: CategoryEditPage },
      { path: 'categories/:id/edit', name: 'categories-edit', component: CategoryEditPage },
      // منو - دسته‌بندی
      { path: 'menu-categories', name: 'menu-categories', component: MenuCategoriesPage },
      { path: 'menu-categories/new', name: 'menu-categories-create', component: MenuCategoryEditPage },
      { path: 'menu-categories/:id/edit', name: 'menu-categories-edit', component: MenuCategoryEditPage },
      // منو - آیتم
      { path: 'menu-items', name: 'menu-items', component: MenuItemsPage },
      { path: 'menu-items/new', name: 'menu-items-create', component: MenuItemEditPage },
      { path: 'menu-items/:id/edit', name: 'menu-items-edit', component: MenuItemEditPage },
      // سفارشات
      { path: 'orders', name: 'orders', component: OrdersPage },
      { path: 'orders/:id', name: 'orders-detail', component: OrderDetailPage },
      // مقالات
      { path: 'articles', name: 'articles', component: ArticlesPage },
      { path: 'articles/new', name: 'articles-create', component: ArticleEditPage },
      { path: 'articles/:id/edit', name: 'articles-edit', component: ArticleEditPage },
      // گالری
      { path: 'gallery', name: 'gallery', component: GalleryPage },
      { path: 'gallery/new', name: 'gallery-create', component: GalleryEditPage },
      { path: 'gallery/:id/edit', name: 'gallery-edit', component: GalleryEditPage },
      // کارکنان
      { path: 'staff', name: 'staff', component: StaffPage },
      { path: 'staff/new', name: 'staff-create', component: StaffEditPage },
      { path: 'staff/:id/edit', name: 'staff-edit', component: StaffEditPage },
      // نظرات
      { path: 'testimonials', name: 'testimonials', component: TestimonialsPage },
      { path: 'testimonials/new', name: 'testimonials-create', component: TestimonialEditPage },
      { path: 'testimonials/:id/edit', name: 'testimonials-edit', component: TestimonialEditPage },
      // کاربران
      { path: 'users', name: 'users', component: UsersPage },
      { path: 'users/:id', name: 'users-detail', component: UserDetailPage },
      // پشتیبانی
      { path: 'support', name: 'support', component: SupportPage },
      { path: 'support/:id', name: 'support-detail', component: TicketDetailPage },
      // تنظیمات
      { path: 'settings', name: 'settings', component: SettingsPage },
    ],
  },
]
```

---

## ۱۰. ساختار دیتابیس (مرور)

| جدول | توضیح |
|------|-------|
| `users` | کاربران (با is_admin, phone) |
| `categories` | دسته‌بندی محصولات |
| `products` | محصولات فروشگاه |
| `menu_categories` | دسته‌بندی منوی کafe |
| `menu_items` | آیتم‌های منو |
| `orders` | سفارشات |
| `order_items` | اقلام سفارش |
| `order_status_history` | تاریخچه وضعیت سفارش |
| `addresses` | آدرس‌های کاربران |
| `wallets` | کیف پول کاربران |
| `wallet_transactions` | تراکنش‌های کیف پول |
| `favorites` | علاقه‌مندی‌های کاربران |
| `articles` | مقالات |
| `gallery` | تصاویر گالری |
| `staff` | کارکنان |
| `testimonials` | نظرات مشتریان |
| `support_tickets` | تیکت‌های پشتیبانی |
| `support_ticket_replies` | پاسخ‌های تیکت |
| `settings` | تنظیمات کلید-مقدار |
| `otp_codes` | کدهای OTP |

---

## ۱۱. نکات اجرایی

### محیط توسعه

```bash
# نصب وابستگی‌ها
cd admin
npm install

# اجرای dev server
npm run dev
# → http://localhost:5173

# اتصال به بک‌اند
# VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### بیلد برای پروداکشن

```bash
npm run build
# خروجی: dist/
# این پوشه روی سرور static (nginx/apache) قرار می‌گیرد
```

### پیکربندی محیط

```env
# .env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## ۱۲. ترتیب پیاده‌سازی پیشنهادی

| مرحله | بخش | توضیح |
|-------|-----|-------|
| ۱ | پروژه + Layout | ساختار پوشه، Vite, Tailwind, AdminLayout |
| ۲ | احراز هویت | صفحه ورود، useAdminAuth, guard مسیرها |
| ۳ | داشبورد | StatsCard, RevenueChart |
| ۴ | محصولات + دسته‌بندی | CRUD کامل + جدول + فرم |
| ۵ | منو | MenuCategory + MenuItem CRUD |
| ۶ | سفارشات | لیست + جزئیات + تغییر وضعیت |
| ۷ | مقالات | CRUD |
| ۸ | گالری | CRUD |
| ۹ | کارکنان + نظرات | CRUD |
| ۱۰ | کاربران | لیست + جزئیات + تغییر نقش |
| ۱۱ | پشتیبانی | لیست + جزئیات + پاسخ |
| ۱۲ | تنظیمات | فرم key-value |
