# داکیومنت فنی Backend و پنل مدیریت فروشگاه قهوه

> تاریخ: تیر ۱۴۰۵
> نسخه فرانت: Nuxt 4 + Tailwind CSS + Pinia
> وضعیت فعلی: تمام APIها با Mock Data کار می‌کنند

---

## فهرست مطالب

1. [نمای کلی معماری](#۱-نمای-کلی-معماری)
2. [مدل داده‌ای (Database Schema)](#۲-مدل-داده‌ای)
3. [احراز هویت و مدیریت کاربران](#۳-احراز-هویت-و-مدیریت-کاربران)
4. [APIهای عمومی (بدون احراز هویت)](#۴-apiهای-عمومی)
5. [APIهای پروفایل کاربر (با احراز هویت)](#۵-apiهای-پروفایل-کاربر)
6. [APIهای سفارش](#۶-apiهای-سفارش)
7. [APIهای پرداخت و کیف پول](#۷-apiهای-پرداخت-و-کیف-پول)
8. [APIهای پشتیبانی](#۸-apiهای-پشتیبانی)
9. [پنل مدیریت (Admin Panel)](#۹-پنل-مدیریت)
10. [قوانین تجاری و اعتبارسنجی](#۱۰-قوانین-تجاری)
11. [ساختار پوشه‌ها](#۱۱-ساختار-پوشه‌ها)

---

## ۱. نمای کلی معماری

### Stack پیشنهادی Backend

| لایه | تکنولوژی پیشنهادی |
|------|---------------|
| Runtime |  PHP 8.2+ (Laravel) |
| Framework |  Laravel  |
| Database |   MySQL |
| ORM |  Eloquent |
| Auth | JWT (Access + Refresh Token) |
| Cache | Redis (برای سیشن و کش) |
| Storage |   لوکال (برای تصاویر) |

### نیازمندی‌های احراز هویت

فرانت فعلی **صفحه لاگین و ثبت‌نام ندارد**. Backend باید سیستم زیر را پیاده‌سازی کند:

- **ثبت‌نام** (شماره موبایل + رمز عبور)
- **لاگین** (شماره موبایل + رمز عبور)
- **OTP** (اختیاری - کد تایید SMS)
- **JWT Token** (Access 15min + Refresh 7days)
- **Reset Password** (بازیابی رمز عبور)

### فلوی احراز هویت

```
کاربر → لاگین → دریافت JWT → ذخیره در localStorage → 
ارسال Authorization Header در هر درخواست → 
تمدید توکن با Refresh Token → لاگ‌اوت
```

---

## ۲. مدل داده‌ای

### 2.1 جدول Users (کاربران)

```sql
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    phone         VARCHAR(11) UNIQUE NOT NULL,  -- شماره موبایل (کلید اصلی ورود)
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(100) NOT NULL DEFAULT '',
    email         VARCHAR(255),
    birth_date    DATE,
    is_active     BOOLEAN DEFAULT TRUE,
    is_admin      BOOLEAN DEFAULT FALSE,       -- دسترسی ادمین
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
```

**قوانین:**
- شماره موبایل: الگوی `^09\d{9}$` (11 رقم، شروع با 09)
- ایمیل: اختیاری، ولی اگر وارد شد باید معتبر باشد
- پسورد: حداقل 6 کاراکتر، هش‌شده با bcrypt

---

### 2.2 جدول Categories (دسته‌بندی محصولات)

```sql
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    image       VARCHAR(500),
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);
```

---

### 2.3 جدول Products (محصولات)

```sql
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) UNIQUE NOT NULL,
    price       INTEGER NOT NULL,              -- قیمت به ریال (1 تومان = 10 ریال)
    image       VARCHAR(500),                  -- URL تصویر
    image_alt   VARCHAR(200) DEFAULT '',
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    description TEXT DEFAULT '',
    rating      DECIMAL(2,1) DEFAULT 0,        -- امتیاز 0-5
    inventory   INTEGER DEFAULT 0,             -- موجودی انبار
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
```

**قوانین:**
- `slug` یکتا باشد (انگلیسی، lowercase، بدون کاراکتر خاص)
- `price` به **ریال** ذخیره شود (فرانت تومان نمایش می‌دهد، ÷10)
- `rating` بین 0 و 5
- `inventory` عدد غیرمنفی
- `category_id` به جدول `categories` وصل است (حذف دسته‌بندی با محصول مرتبط مجاز نیست)

---

### 2.3 جدول Addresses (آدرس‌ها)

```sql
CREATE TABLE addresses (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(100) NOT NULL,      -- عنوان آدرس (خانه، محل کار و...)
    receiver_name  VARCHAR(100) NOT NULL,      -- نام تحویل‌گیرنده
    phone          VARCHAR(11) NOT NULL,       -- شماره تماس تحویل‌گیرنده
    province       VARCHAR(100) NOT NULL,      -- استان
    city           VARCHAR(100) NOT NULL,      -- شهر
    address        TEXT NOT NULL,              -- آدرس کامل
    postal_code    VARCHAR(10) NOT NULL,       -- کد پستی
    plaque         VARCHAR(20),                -- پلاک
    unit           VARCHAR(10),                -- واحد
    latitude       DECIMAL(10,8),              -- عرض جغرافیایی
    longitude      DECIMAL(11,8),              -- طول جغرافیایی
    is_default     BOOLEAN DEFAULT FALSE,      -- آدرس پیش‌فرض
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
```

**قوانین:**
- هر کاربر حداکثر ۱۰ آدرس داشته باشد
- فقط یک آدرس می‌تواند `is_default` باشد
- حذف آدرس پیش‌فرض → اولین آدرس بعدی پیش‌فرض شود

---

### 2.5 جدول Orders (سفارش‌ها)

```sql
CREATE TABLE orders (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id),
    status            VARCHAR(20) NOT NULL DEFAULT 'pending',
    action_status     VARCHAR(30) NOT NULL DEFAULT 'none',

    -- آدرس سفارش (کپی از آدرس کاربر در لحظه ثبت)
    receiver_name     VARCHAR(100) NOT NULL,
    receiver_phone    VARCHAR(11) NOT NULL,
    province          VARCHAR(100) NOT NULL,
    city              VARCHAR(100) NOT NULL,
    order_address     TEXT NOT NULL,
    postal_code       VARCHAR(10) NOT NULL,

    -- ارسال
    shipping_method   VARCHAR(50) NOT NULL,     -- post, express, pickup
    shipping_cost     INTEGER NOT NULL DEFAULT 0, -- به ریال
    tracking_code     VARCHAR(100),
    estimated_delivery TIMESTAMP,
    delivered_at      TIMESTAMP,

    -- پرداخت
    payment_method    VARCHAR(30) NOT NULL,     -- online, wallet, cash_on_delivery
    payment_status    VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id    VARCHAR(100),
    paid_at           TIMESTAMP,

    -- مبالغ (همه به ریال)
    total             INTEGER NOT NULL,         -- مبلغ کل سفارش
    wallet_amount     INTEGER DEFAULT 0,        -- مبلغ کسر شده از کیف پول
    payable_amount    INTEGER NOT NULL,         -- مبلغ قابل پرداخت
    discount_amount   INTEGER DEFAULT 0,
    tax_amount        INTEGER DEFAULT 0,
    description       TEXT,

    -- لغو و مرجوعی
    cancel_reason     TEXT,
    cancel_requested_at TIMESTAMP,
    return_reason     TEXT,
    return_requested_at TIMESTAMP,

    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

**مقادیر `status`:**
- `pending` - در انتظار پرداخت
- `processing` - در حال پردازش
- `shipped` - ارسال شده
- `delivered` - تحویل شده
- `canceled` - لغو شده

**مقادیر `action_status`:**
- `none` - بدون عملیات
- `cancel_requested` - درخواست لغو ثبت شده
- `cancel_approved` - لغو تایید شده
- `cancel_rejected` - لغو رد شده
- `return_requested` - درخواست مرجوعی ثبت شده
- `return_approved` - مرجوعی تایید شده
- `return_rejected` - مرجوعی رد شده
- `returned` - مرجوع شده

---

### 2.6 جدول Order Items (اقلام سفارش)

```sql
CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    quantity    INTEGER NOT NULL,
    unit_price  INTEGER NOT NULL,              -- قیمت واحد به ریال (در لحظه خرید)
    subtotal    INTEGER GENERATED ALWAYS AS (quantity * unit_price) STORED,

    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**نکته:** `unit_price` کپی از قیمت محصول در لحظه خرید است (قیمت ممکن است بعداً تغییر کند).

---

### 2.7 جدول Order Status History (تاریخچه وضعیت سفارش)

```sql
CREATE TABLE order_status_history (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
```

---

### 2.8 جدول Wallets (کیف پول)

```sql
CREATE TABLE wallets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER UNIQUE NOT NULL REFERENCES users(id),
    balance     INTEGER NOT NULL DEFAULT 0,    -- موجودی به ریال
    currency    VARCHAR(5) DEFAULT 'IRR',
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id            SERIAL PRIMARY KEY,
    wallet_id     INTEGER NOT NULL REFERENCES wallets(id),
    type          VARCHAR(20) NOT NULL,        -- charge, purchase, refund, adjustment
    direction     VARCHAR(10) NOT NULL,        -- credit, debit
    status        VARCHAR(20) NOT NULL DEFAULT 'completed',
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    amount        INTEGER NOT NULL,            -- مبلغ به ریال
    order_id      INTEGER REFERENCES orders(id),
    reference_id  VARCHAR(100),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);
```

**قوانین کیف پول:**
- هر کاربر فقط یک کیف پول دارد
- موجودی هیچوقت منفی نمی‌شود
- `charge`: افزایش موجودی (direction: credit)
- `purchase`: کسر از موجودی (direction: debit)
- `refund`: بازگشت وجه (direction: credit)
- `adjustment`: اصلاح موجودی توسط ادمین

---

### 2.9 جدول Favorites (علاقه‌مندی‌ها)

```sql
CREATE TABLE favorites (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
```

---

### 2.10 جدول Menu Categories (دسته‌بندی منو)

```sql
CREATE TABLE menu_categories (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

### 2.11 جدول Menu Items (اقلام منو)

```sql
CREATE TABLE menu_items (
    id              SERIAL PRIMARY KEY,
    category_id     INTEGER NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    price           INTEGER NOT NULL,          -- به ریال
    is_available    BOOLEAN DEFAULT TRUE,
    is_popular      BOOLEAN DEFAULT FALSE,
    image           VARCHAR(500),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
```

---

### 2.12 جدول Articles (مقالات)

```sql
CREATE TABLE articles (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) UNIQUE NOT NULL,
    description TEXT DEFAULT '',               -- خلاصه مقاله
    content     TEXT NOT NULL,                 -- محتوای کامل (HTML یا Markdown)
    image       VARCHAR(500),
    image_alt   VARCHAR(200) DEFAULT '',
    author      VARCHAR(100),
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_is_active ON articles(is_active);
```

---

### 2.13 جدول Gallery (گالری تصاویر)

```sql
CREATE TABLE gallery (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) UNIQUE NOT NULL,
    image       VARCHAR(500) NOT NULL,
    image_alt   VARCHAR(200) DEFAULT '',
    category    VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

### 2.14 جدول Staff (کارکنان)

```sql
CREATE TABLE staff (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    role        VARCHAR(100) NOT NULL,         -- عنوان شغلی
    description TEXT DEFAULT '',
    image       VARCHAR(500),
    instagram   VARCHAR(200),
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

### 2.15 جدول Testimonials (نظرات مشتریان)

```sql
CREATE TABLE testimonials (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    role        VARCHAR(100),                  -- عنوان شغلی یا توضیح
    comment     TEXT NOT NULL,
    rating      INTEGER NOT NULL DEFAULT 5,    -- 1 تا 5
    image       VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE CONSTRAINT chk_testimonials_rating CHECK (rating >= 1 AND rating <= 5);
```

---

### 2.16 جدول Support Tickets (تیکت‌های پشتیبانی)

```sql
CREATE TABLE support_tickets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    order_id    INTEGER REFERENCES orders(id),
    subject     VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'open',
    priority    VARCHAR(10) NOT NULL DEFAULT 'normal',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_ticket_replies (
    id          SERIAL PRIMARY KEY,
    ticket_id   INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender      VARCHAR(10) NOT NULL,          -- 'user' یا 'admin'
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
```

**مقادیر `status`:**
- `open` - باز
- `in_progress` - در حال بررسی
- `answered` - پاسخ داده شده
- `closed` - بسته شده

---

## ۳. احراز هویت و مدیریت کاربران

### 3.1 ثبت‌نام

```
POST /api/auth/register
```

**Request Body:**
```json
{
    "phone": "09123456789",
    "password": "123456",
    "name": "علی رضایی"
}
```

**Response 201:**
```json
{
    "success": true,
    "message": "ثبت‌نام با موفقیت انجام شد",
    "data": {
        "user": {
            "id": 1,
            "phone": "09123456789",
            "name": "علی رضایی",
            "email": null,
            "birthDate": null
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
        "expiresIn": 900
    }
}
```

**Validation Rules:**
- `phone`: الزامی، الگوی `^09\d{9}$`، یکتا
- `password`: الزامی، حداقل 6 کاراکتر
- `name`: اختیاری

**Error Responses:**
- `422`: شماره موبایل قبلاً ثبت شده
- `422`: شماره موبایل معتبر نیست
- `422`: رمز عبور کوتاه است

---

### 3.2 ورود (لاگین)

```
POST /api/auth/login
```

**Request Body:**
```json
{
    "phone": "09123456789",
    "password": "123456"
}
```

**Response 200:**
```json
{
    "success": true,
    "message": "ورود موفقیت‌آمیز بود",
    "data": {
        "user": {
            "id": 1,
            "phone": "09123456789",
            "name": "علی رضایی",
            "email": null,
            "birthDate": null
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
        "expiresIn": 900
    }
}
```

**Error Responses:**
- `401`: شماره موبایل یا رمز عبور اشتباه است
- `403`: حساب کاربری غیرفعال است

---

### 3.3 تمدید توکن

```
POST /api/auth/refresh
```

**Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
    "success": true,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
        "expiresIn": 900
    }
}
```

---

### 3.4 دریافت اطلاعات کاربر جاری

```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "phone": "09123456789",
        "name": "علی رضایی",
        "email": "ali@example.com",
        "birthDate": "1375-03-15",
        "isAdmin": false,
        "createdAt": "2026-01-15T10:00:00Z"
    }
}
```

---

### 3.5 بروزرسانی پروفایل

```
PUT /api/auth/profile
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "name": "علی رضایی جدید",
    "email": "ali@example.com",
    "birthDate": "1375-03-15"
}
```

**Response 200:**
```json
{
    "success": true,
    "message": "پروفایل بروزرسانی شد",
    "data": {
        "id": 1,
        "phone": "09123456789",
        "name": "علی رضایی جدید",
        "email": "ali@example.com",
        "birthDate": "1375-03-15"
    }
}
```

---

### 3.6 تغییر رمز عبور

```
PUT /api/auth/password
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "currentPassword": "123456",
    "newPassword": "654321"
}
```

---

### 3.7 خروج (لاگ‌اوت)

```
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "message": "خروج موفقیت‌آمیز بود"
}
```

**نکته:** توکن refresh باید در blacklist قرار بگیرد.

---

## ۴. APIهای عمومی (بدون احراز هویت)

### 4.1 لیست محصولات

```
GET /api/products
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "اسپرسو",
            "slug": "espresso",
            "price": 350000,
            "image": "/images/products/espresso.jpg",
            "imageAlt": "قهوه اسپرسو",
            "category": "قهوه",
            "description": "قهوه اسپرسو با عطر و طعم قوی",
            "rating": 4.5,
            "inventory": 10,
            "isFavorite": false
        }
    ]
}
```

**نکته:** فیلد `isFavorite` فقط وقتی true است که کاربر لاگین باشد و محصول در علاقه‌مندی‌هایش باشد. در غیر این صورت false برمی‌گردد.

---

### 4.2 جزئیات محصول

```
GET /api/products/:slug
```

**Response 200:** مشابه آیتم بالا با جزئیات بیشتر

**Error:** `404` - محصول پیدا نشد

---

### 4.3 لیست دسته‌بندی‌های منو

```
GET /api/menu-categories
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "قهوه",
            "slug": "coffee",
            "description": "انواع قهوه",
            "icon": "☕",
            "sortOrder": 1,
            "isActive": true,
            "items": [
                {
                    "id": 1,
                    "title": "اسپرسو",
                    "description": "تک شات",
                    "price": 350000,
                    "isAvailable": true,
                    "isPopular": true
                }
            ]
        }
    ]
}
```

---

### 4.4 جزئیات دسته‌بندی منو

```
GET /api/menu-categories/:slug
```

---

### 4.5 لیست مقالات

```
GET /api/articles
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "تاریخچه قهوه",
            "slug": "coffee-history",
            "description": "قهوه نوشیدنی محبوب...",
            "content": "<p>محتوای کامل مقاله...</p>",
            "image": "/images/articles/coffee-history.jpg",
            "imageAlt": "تاریخچه قهوه",
            "author": "مدیر فروشگاه",
            "createdAt": "2026-01-15T10:00:00Z",
            "isActive": true,
            "sortOrder": 1
        }
    ]
}
```

---

### 4.6 جزئیات مقاله

```
GET /api/articles/:slug
```

---

### 4.7 لیست گالری

```
GET /api/gallery
```

---

### 4.8 جزئیات تصویر گالری

```
GET /api/gallery/:slug
```

---

### 4.9 لیست کارکنان

```
GET /api/staffs
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "رضا احمدی",
            "role": "باریستا",
            "description": "متخصص قهوه...",
            "image": "/images/staff/reza.jpg",
            "instagram": "@reza_coffee",
            "sortOrder": 1,
            "isActive": true
        }
    ]
}
```

---

### 4.10 لیست نظرات مشتریان

```
GET /api/testimonials
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "سارا محمدی",
            "role": "مشتری دائمی",
            "comment": "قهوه‌های فوق‌العاده‌ای دارند...",
            "rating": 5,
            "image": "/images/testimonials/sara.jpg",
            "isActive": true,
            "sortOrder": 1
        }
    ]
}
```

---

## ۵. APIهای پروفایل کاربر (با احراز هویت)

> تمام این درخواست‌ها نیاز به `Authorization: Bearer <accessToken>` دارند.

### 5.1 آدرس‌ها

#### لیست آدرس‌ها
```
GET /api/profile/addresses
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "خانه",
            "receiverName": "علی رضایی",
            "phone": "09123456789",
            "province": "تهران",
            "city": "تهران",
            "address": "خیابان ولیعصر، کوچه نمونه، پلاک ۱۲",
            "postalCode": "1234567890",
            "plaque": "۱۲",
            "unit": "۳",
            "latitude": 35.6892,
            "longitude": 51.3890,
            "isDefault": true,
            "createdAt": "2026-01-15T10:00:00Z",
            "updatedAt": "2026-01-15T10:00:00Z"
        }
    ]
}
```

#### ایجاد آدرس
```
POST /api/profile/addresses
```

**Request Body:**
```json
{
    "title": "محل کار",
    "receiverName": "علی رضایی",
    "phone": "09123456789",
    "province": "تهران",
    "city": "تهران",
    "address": "خیابان ولیعصر، پلاک ۱۲",
    "postalCode": "1234567890",
    "plaque": "۱۲",
    "unit": "۳",
    "isDefault": false
}
```

**Response 201:**
```json
{
    "success": true,
    "message": "آدرس با موفقیت ثبت شد",
    "data": {
        "id": 2,
        "title": "محل کار",
        ...
    }
}
```

**Validation Rules:**
- `title`: الزامی
- `receiverName`: الزامی
- `phone`: الزامی، الگوی `^09\d{9}$`
- `province`: الزامی
- `city`: الزامی
- `address`: الزامی
- `postalCode`: الزامی، 10 رقمی

#### بروزرسانی آدرس
```
PUT /api/profile/addresses/:id
```

#### حذف آدرس
```
DELETE /api/profile/addresses/:id
```

#### تنظیم آدرس پیش‌فرض
```
PATCH /api/profile/addresses/:id/default
```

---

### 5.2 علاقه‌مندی‌ها

#### لیست علاقه‌مندی‌ها
```
GET /api/profile/favorites
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "اسپرسو",
            "slug": "espresso",
            "price": 350000,
            "image": "/images/products/espresso.jpg",
            "imageAlt": "قهوه اسپرسو",
            "category": "قهوه",
            "description": "...",
            "rating": 4.5,
            "inventory": 10
        }
    ]
}
```

**نکته:** Response آرایه‌ای از объект Product است (نه FavoriteItem).

#### افزودن به علاقه‌مندی‌ها
```
POST /api/profile/favorites
```

**Request Body:**
```json
{
    "productId": 1
}
```

#### حذف از علاقه‌مندی‌ها
```
DELETE /api/profile/favorites/:productId
```

---

## ۶. APIهای سفارش

### 6.1 ایجاد سفارش

```
POST /api/orders/create
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "address": {
        "receiverName": "علی رضایی",
        "phone": "09123456789",
        "province": "تهران",
        "city": "تهران",
        "postalCode": "1234567890",
        "address": "خیابان ولیعصر، پلاک ۱۲"
    },
    "shipping": {
        "method": "post",
        "cost": 60000
    },
    "payment": {
        "method": "online"
    },
    "useWallet": true,
    "items": [
        {
            "productId": 1,
            "quantity": 2,
            "unitPrice": 350000
        },
        {
            "productId": 3,
            "quantity": 1,
            "unitPrice": 550000
        }
    ],
    "total": 1310000
}
```

**پارامترهای `shipping.method`:**
- `post` - پست پیشتاز (هزینه: 60,000 ریال)
- `express` - ارسال فوری (هزینه: 120,000 ریال)
- `pickup` - تحویل حضوری (هزینه: 0)

**پارامترهای `payment.method`:**
- `online` - پرداخت آنلاین
- `cash_on_delivery` - پرداخت در محل (فقط وقتی useWallet=false یا مبلغ باقی‌مانده > 0)

**پارامتر `useWallet`:**
- `true`: از موجودی کیف پول کسر می‌شود
- `false`: پرداخت کامل با روش انتخابی

**Response 201:**
```json
{
    "success": true,
    "message": "سفارش با موفقیت ثبت شد",
    "data": {
        "id": 1720000000000,
        "date": "2026-07-11T10:00:00Z",
        "status": "pending",
        "actionStatus": "none",
        "total": 1310000,
        "walletAmount": 250000,
        "payableAmount": 1060000,
        "address": { ... },
        "shipping": { "method": "post", "cost": 60000 },
        "payment": {
            "method": "online",
            "status": "pending"
        },
        "discountAmount": 0,
        "taxAmount": 0,
        "statusHistory": [
            {
                "status": "order_created",
                "description": "سفارش با موفقیت ثبت شد",
                "date": "2026-07-11T10:00:00Z"
            },
            {
                "status": "pending",
                "description": "250,000 تومان از کیف پول کسر شد...",
                "date": "2026-07-11T10:00:00Z"
            }
        ],
        "items": [
            { "productId": 1, "quantity": 2, "unitPrice": 350000 },
            { "productId": 3, "quantity": 1, "unitPrice": 550000 }
        ]
    },
    "wallet": {
        "balance": 2250000,
        "currency": "IRR",
        "updatedAt": "2026-07-11T10:00:00Z"
    },
    "walletTransaction": {
        "id": 1720000000001,
        "type": "purchase",
        "direction": "debit",
        "status": "completed",
        "title": "پرداخت سفارش",
        "amount": 250000,
        "orderId": 1720000000000,
        "referenceId": "WALLET-PAY-1720000000000",
        "createdAt": "2026-07-11T10:00:00Z"
    }
}
```

**قوانین تجاری:**
- `items` نمی‌تواند خالی باشد
- `address` الزامی است
- `payment.method` الزامی است
- اگر `useWallet=true` و موجودی کافی نباشد → خطا
- اگر `useWallet=true` و مبلغ کل ≤ موجودی → `payment.method` = `wallet`
- `unitPrice` باید با قیمت واقعی محصول مطابقت داشته باشد (برای جلوگیری از تقلب)
- `total` باید با محاسبه سرور برابر باشد: `itemsSubtotal + shippingCost + taxAmount - discountAmount`

---

### 6.2 لیست سفارش‌های کاربر

```
GET /api/profile/orders
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1720000000000,
            "date": "2026-07-11T10:00:00Z",
            "status": "processing",
            "actionStatus": "none",
            "total": 1310000,
            "walletAmount": 250000,
            "payableAmount": 1060000,
            "address": { ... },
            "shipping": { ... },
            "payment": { ... },
            "discountAmount": 0,
            "taxAmount": 0,
            "description": "لطفاً بسته‌بندی محکم باشد",
            "statusHistory": [ ... ],
            "items": [
                {
                    "productId": 1,
                    "quantity": 2,
                    "unitPrice": 350000,
                    "product": {
                        "id": 1,
                        "title": "اسپرسو",
                        "slug": "espresso",
                        "price": 350000,
                        "image": "/images/products/espresso.jpg",
                        "imageAlt": "قهوه اسپرسو",
                        "category": "قهوه",
                        "description": "...",
                        "rating": 4.5,
                        "inventory": 10
                    },
                    "subtotal": 700000
                }
            ],
            "itemsCount": 3,
            "itemsSubtotal": 1250000
        }
    ]
}
```

**نکته:** در Response لیست، `items` شامل اطلاعات کامل محصول (`OrderItemWithProduct`) است.

---

### 6.3 جزئیات سفارش

```
GET /api/profile/orders/:id
Authorization: Bearer <accessToken>
```

Response مشابه آیتم بالا (تک سفارش).

---

### 6.4 درخواست لغو سفارش

```
POST /api/profile/orders/:id/cancel
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "reason": "از خرید منصرف شده‌ام"
}
```

**Response 200:**
```json
{
    "success": true,
    "message": "درخواست لغو سفارش ثبت شد و در حال بررسی است."
}
```

**قوانین:**
- فقط سفارش‌هایی با `status` = `pending` یا `processing` قابل لغو هستند
- فقط وقتی `actionStatus` = `none` باشد
- اگر با کیف پول پرداخت شده، وضعیت کیف پول برگشت داده شود

---

### 6.5 درخواست مرجوعی سفارش

```
POST /api/profile/orders/:id/return
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "reason": "محصول آسیب‌دیده تحویل شده است"
}
```

**قوانین:**
- فقط سفارش‌هایی با `status` = `delivered` قابل مرجوعی هستند
- فقط وقتی `actionStatus` = `none` باشد

---

## ۷. APIهای پرداخت و کیف پول

### 7.1 دریافت موجودی کیف پول

```
GET /api/profile/wallet
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "data": {
        "balance": 2500000,
        "currency": "IRR",
        "updatedAt": "2026-07-11T10:00:00Z"
    }
}
```

---

### 7.2 تراکنش‌های کیف پول

```
GET /api/profile/wallet/transactions
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "type": "charge",
            "direction": "credit",
            "status": "completed",
            "title": "افزایش موجودی",
            "description": "شارژ کیف پول از درگاه پرداخت",
            "amount": 3000000,
            "referenceId": "PAY-12345",
            "createdAt": "2026-07-10T15:00:00Z"
        }
    ]
}
```

---

### 7.3 شارژ کیف پول

```
POST /api/profile/wallet/charge
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "amount": 500000
}
```

**Response 200:**
```json
{
    "success": true,
    "message": "کیف پول با موفقیت شارژ شد",
    "data": {
        "wallet": {
            "balance": 3000000,
            "currency": "IRR",
            "updatedAt": "2026-07-11T10:00:00Z"
        },
        "transaction": {
            "id": 2,
            "type": "charge",
            "direction": "credit",
            "status": "completed",
            "title": "افزایش موجودی",
            "amount": 500000,
            "referenceId": "PAY-67890",
            "createdAt": "2026-07-11T10:00:00Z"
        }
    }
}
```

**نکته:** در نسخه واقعی، بعد از این درخواست باید کاربر به درگاه پرداخت هدایت شود و بعد از تایید، موجودی افزایش یابد.

---

## ۸. APIهای پشتیبانی

### 8.1 لیست تیکت‌ها

```
GET /api/profile/support
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "orderId": 1720000000000,
            "subject": "پیگیری ارسال سفارش",
            "message": "کد رهگیری پستی فعال نیست",
            "status": "answered",
            "priority": "normal",
            "createdAt": "2026-07-10T10:00:00Z",
            "updatedAt": "2026-07-10T14:00:00Z"
        }
    ]
}
```

---

### 8.2 ایجاد تیکت

```
POST /api/profile/support
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
    "orderId": 1720000000000,
    "subject": "پیگیری ارسال سفارش",
    "message": "کد رهگیری پستی فعال نیست",
    "priority": "normal"
}
```

**Validation Rules:**
- `subject`: الزامی
- `message`: الزامی
- `orderId`: اختیاری
- `priority`: یکی از `low`، `normal`، `high`

---

## ۹. پنل مدیریت (Admin Panel)

### 9.1 نیازمندی‌های پنل ادمین

پنل ادمین باید امکان مدیریت تمام داده‌های سایت را فراهم کند. از آنجایی که فرانت فعلی فقط خواندن داده‌ها را انجام می‌دهد، **تمام CRUD عملیات‌ها باید در پنل ادمین پیاده‌سازی شوند.**

### 9.2 احراز هویت ادمین

```
POST /api/admin/login
```

**Request Body:**
```json
{
    "phone": "09123456789",
    "password": "admin123"
}
```

**نکته:** کاربرانی که `is_admin = true` باشند می‌توانند وارد پنل شوند.

### 9.3 ساختار منوی پنل ادمین

```
پنل مدیریت
├── داشبورد (آمار کلی)
├── محصولات
│   ├── لیست محصولات
│   ├── افزودن محصول
│   ├── ویرایش محصول
│   └── حذف محصول
├── دسته‌بندی‌ها
│   ├── لیست دسته‌بندی‌ها
│   ├── افزودن دسته‌بندی
│   └── ویرایش دسته‌بندی
├── منو
│   ├── لیست دسته‌بندی‌های منو
│   ├── افزودن دسته‌بندی منو
│   ├── لیست اقلام منو
│   ├── افزودن قلم منو
│   └── ویرایش اقلام منو
├── سفارشات
│   ├── لیست سفارشات
│   ├── جزئیات سفارش
│   ├── تغییر وضعیت سفارش
│   ├── تایید/رد لغو
│   └── تایید/رد مرجوعی
├── کاربران
│   ├── لیست کاربران
│   ├── جزئیات کاربر
│   └── غیرفعال‌سازی کاربر
├── آدرس‌ها
│   └── (فقط مشاهده - مدیریت توسط کاربر)
├── پرداخت‌ها
│   ├── تراکنش‌های کیف پول
│   └── اصلاح موجودی کیف پول
├── مقالات
│   ├── لیست مقالات
│   ├── افزودن مقاله
│   ├── ویرایش مقاله
│   └── حذف مقاله
├── گالری
│   ├── لیست تصاویر
│   ├── افزودن تصویر
│   └── حذف تصویر
├── کارکنان
│   ├── لیست کارکنان
│   ├── افزودن کارمند
│   ├── ویرایش کارمند
│   └── حذف کارمند
├── نظرات مشتریان
│   ├── لیست نظرات
│   ├── افزودن نظر
│   ├── ویرایش نظر
│   └── حذف نظر
├── پشتیبانی
│   ├── لیست تیکت‌ها
│   ├── جزئیات تیکت
│   ├── پاسخ به تیکت
│   └── بستن تیکت
└── تنظیمات
    ├── اطلاعات فروشگاه
    ├── هزینه ارسال
    └── مالیات
```

---

### 9.4 APIهای پنل ادمین

> تمام درخواست‌ها نیاز به `Authorization: Bearer <adminAccessToken>` دارند.

#### 9.4.1 داشبورد

```
GET /api/admin/dashboard
```

**Response 200:**
```json
{
    "success": true,
    "data": {
        "totalOrders": 150,
        "totalRevenue": 45000000,
        "totalUsers": 89,
        "totalProducts": 25,
        "pendingOrders": 12,
        "recentOrders": [ ... ],
        "monthlySales": [
            { "month": "1404-01", "count": 45, "revenue": 13500000 },
            { "month": "1404-02", "count": 52, "revenue": 15600000 }
        ]
    }
}
```

---

#### 9.4.2 مدیریت محصولات

**لیست محصولات (با صفحه‌بندی و جستجو):**
```
GET /api/admin/products?page=1&limit=20&search=اسپرسو&category=قهوه
```

**ایجاد محصول:**
```
POST /api/admin/products
```

**Request Body:**
```json
{
    "title": "اسپرسو",
    "slug": "espresso",
    "price": 350000,
    "image": "/images/products/espresso.jpg",
    "imageAlt": "قهوه اسپرسو",
    "category": "قهوه",
    "description": "قهوه اسپرسو با عطر و طعم قوی",
    "rating": 4.5,
    "inventory": 10,
    "isActive": true,
    "sortOrder": 1
}
```

**بروزرسانی محصول:**
```
PUT /api/admin/products/:id
```

**حذف محصول:**
```
DELETE /api/admin/products/:id
```

**تغییر موجودی:**
```
PATCH /api/admin/products/:id/inventory
```

```json
{
    "inventory": 15
}
```

---

#### 9.4.3 مدیریت سفارشات

**لیست سفارشات (با فیلتر و صفحه‌بندی):**
```
GET /api/admin/orders?page=1&limit=20&status=pending&dateFrom=2026-07-01&dateTo=2026-07-11
```

**جزئیات سفارش:**
```
GET /api/admin/orders/:id
```

**تغییر وضعیت سفارش:**
```
PATCH /api/admin/orders/:id/status
```

**Request Body:**
```json
{
    "status": "processing",
    "description": "سفارش در حال آماده‌سازی است"
}
```

**تغییر وضعیت عملیات (تایید/رد لغو یا مرجوعی):**
```
PATCH /api/admin/orders/:id/action
```

**Request Body:**
```json
{
    "actionStatus": "cancel_approved",
    "description": "لغو سفارش تایید شد"
}
```

**ثبت کد رهگیری:**
```
PATCH /api/admin/orders/:id/tracking
```

```json
{
    "trackingCode": "POST-123456789",
    "estimatedDeliveryDate": "2026-07-15T18:00:00Z"
}
```

---

#### 9.4.4 مدیریت کاربران

**لیست کاربران:**
```
GET /api/admin/users?page=1&limit=20&search=علی
```

**جزئیات کاربر:**
```
GET /api/admin/users/:id
```

**غیرفعال‌سازی کاربر:**
```
PATCH /api/admin/users/:id/status
```

```json
{
    "isActive": false
}
```

---

#### 9.4.5 مدیریت مقالات

**لیست مقالات:**
```
GET /api/admin/articles?page=1&limit=20
```

**ایجاد مقاله:**
```
POST /api/admin/articles
```

**Request Body:**
```json
{
    "title": "تاریخچه قهوه",
    "slug": "coffee-history",
    "description": "قهوه نوشیدنی محبوب...",
    "content": "<p>محتوای کامل مقاله...</p>",
    "image": "/images/articles/coffee-history.jpg",
    "imageAlt": "تاریخچه قهوه",
    "author": "مدیر فروشگاه",
    "isActive": true,
    "sortOrder": 1
}
```

**بروزرسانی مقاله:**
```
PUT /api/admin/articles/:id
```

**حذف مقاله:**
```
DELETE /api/admin/articles/:id
```

---

#### 9.4.6 مدیریت گالری

**لیست تصاویر:**
```
GET /api/admin/gallery?page=1&limit=20
```

**ایجاد تصویر:**
```
POST /api/admin/gallery
```

**Request Body:**
```json
{
    "title": "اسپرسو",
    "slug": "espresso-shot",
    "image": "/images/gallery/espresso-shot.jpg",
    "imageAlt": "تصویر اسپرسو",
    "category": "قهوه",
    "description": "تصویر زیبای یک فنجان اسپرسو",
    "isActive": true,
    "sortOrder": 1
}
```

**حذف تصویر:**
```
DELETE /api/admin/gallery/:id
```

---

#### 9.4.7 مدیریت کارکنان

**ایجاد کارمند:**
```
POST /api/admin/staff
```

```json
{
    "name": "رضا احمدی",
    "role": "باریستا",
    "description": "متخصص قهوه با ۵ سال تجربه",
    "image": "/images/staff/reza.jpg",
    "instagram": "@reza_coffee",
    "isActive": true,
    "sortOrder": 1
}
```

---

#### 9.4.8 مدیریت نظرات مشتریان

**ایجاد نظر:**
```
POST /api/admin/testimonials
```

```json
{
    "name": "سارا محمدی",
    "role": "مشتری دائمی",
    "comment": "قهوه‌های فوق‌العاده‌ای دارند",
    "rating": 5,
    "image": "/images/testimonials/sara.jpg",
    "isActive": true,
    "sortOrder": 1
}
```

---

#### 9.4.9 مدیریت پشتیبانی

**لیست تیکت‌ها (فیلتر بر اساس وضعیت):**
```
GET /api/admin/support?status=open&page=1&limit=20
```

**جزئیات تیکت:**
```
GET /api/admin/support/:id
```

**پاسخ به تیکت:**
```
POST /api/admin/support/:id/reply
```

```json
{
    "message": "کد رهگیری شما POST-123456789 است."
}
```

**تغییر وضعیت تیکت:**
```
PATCH /api/admin/support/:id/status
```

```json
{
    "status": "answered"
}
```

---

#### 9.4.10 مدیریت دسته‌بندی منو

**ایجاد دسته‌بندی منو:**
```
POST /api/admin/menu-categories
```

```json
{
    "title": "قهوه",
    "slug": "coffee",
    "description": "انواع قهوه",
    "icon": "☕",
    "isActive": true,
    "sortOrder": 1
}
```

**ایجاد قلم منو:**
```
POST /api/admin/menu-items
```

```json
{
    "categoryId": 1,
    "title": "اسپرسو",
    "description": "تک شات",
    "price": 350000,
    "isAvailable": true,
    "isPopular": true,
    "sortOrder": 1
}
```

---

#### 9.4.11 مدیریت تنظیمات

**دریافت تنظیمات:**
```
GET /api/admin/settings
```

**بروزرسانی تنظیمات:**
```
PUT /api/admin/settings
```

```json
{
    "storeName": "فروشگاه قهوه",
    "storePhone": "02112345678",
    "storeAddress": "تهران، خیابان ولیعصر",
    "shippingCosts": {
        "post": 60000,
        "express": 120000,
        "pickup": 0
    },
    "taxRate": 0,
    "minOrderAmount": 100000
}
```

---

## ۱۰. قوانین تجاری و اعتبارسنجی

### 10.1 قیمت‌گذاری

- تمام مبالغ در Backend به **ریال** ذخیره می‌شوند
- فرانت مبالغ را ÷10 کرده و به **تومان** نمایش می‌دهد
- فرمت نمایش: `Intl.NumberFormat('fa-IR')`

### 10.2 موجودی

- هنگام ثبت سفارش، `inventory` محصول کاهش یابد
- اگر موجودی کافی نباشد → خطا
- هنگام لغو سفارش، موجودی برگشت داده شود
- هنگام مرجوعی، موجودی برگشت داده شود

### 10.3 قیمت در سفارش

- `unitPrice` در سفارش باید با قیمت واقعی محصول مطابقت داشته باشد
- Backend باید قیمت واقعی را از دیتابیس بخواند (نه از Request کلاینت)
- این کار جلوی تقلب (تغییر قیمت در درخواست) را می‌گیرد

### 10.4 محاسبه مبلغ سفارش

```
itemsSubtotal = SUM(unitPrice × quantity) برای تمام اقلام
total = itemsSubtotal + shippingCost + taxAmount - discountAmount
```

### 10.5 پرداخت ترکیبی (کیف پول + درگاه)

```
walletAmount = MIN(balance, total)
payableAmount = MAX(total - walletAmount, 0)
```

### 10.6 وضعیت سفارش

```
order_created → pending → processing → shipped → delivered
                                      ↓
                                    canceled

delivered → return_requested → return_approved → returned
                                    ↓
                                  return_rejected
```

### 10.7 آدرس پیش‌فرض

- هنگام ایجاد آدرس جدید با `isDefault=true`، تمام آدرس‌های قبلی `isDefault=false` شوند
- حذف آدرس پیش‌فرض → اولین آدرس بعدی پیش‌فرض شود

---

## ۱۱. ساختار پوشه‌ها

### Backend پیشنهادی (NestJS)

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       └── refresh-token.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/user.entity.ts
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── entities/product.entity.ts
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── entities/category.entity.ts
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── entities/
│       ├── order.entity.ts
│       ├── order-item.entity.ts
│       └── order-status-history.entity.ts
├── addresses/
│   ├── addresses.module.ts
│   ├── addresses.controller.ts
│   ├── addresses.service.ts
│   └── entities/address.entity.ts
├── wallet/
│   ├── wallet.module.ts
│   ├── wallet.controller.ts
│   ├── wallet.service.ts
│   └── entities/
│       ├── wallet.entity.ts
│       └── wallet-transaction.entity.ts
├── favorites/
│   ├── favorites.module.ts
│   ├── favorites.controller.ts
│   ├── favorites.service.ts
│   └── entities/favorite.entity.ts
├── support/
│   ├── support.module.ts
│   ├── support.controller.ts
│   ├── support.service.ts
│   └── entities/
│       ├── support-ticket.entity.ts
│       └── support-ticket-reply.entity.ts
├── menu/
│   ├── menu.module.ts
│   ├── menu.controller.ts
│   ├── menu.service.ts
│   └── entities/
│       ├── menu-category.entity.ts
│       └── menu-item.entity.ts
├── articles/
│   ├── articles.module.ts
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   └── entities/article.entity.ts
├── gallery/
│   ├── gallery.module.ts
│   ├── gallery.controller.ts
│   ├── gallery.service.ts
│   └── entities/gallery.entity.ts
├── staff/
│   ├── staff.module.ts
│   ├── staff.controller.ts
│   ├── staff.service.ts
│   └── entities/staff.entity.ts
├── testimonials/
│   ├── testimonials.module.ts
│   ├── testimonials.controller.ts
│   ├── testimonials.service.ts
│   └── entities/testimonial.entity.ts
├── admin/
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── guards/
│       └── admin.guard.ts
├── common/
│   ├── interceptors/
│   │   └── transform-response.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── decorators/
│       ├── current-user.decorator.ts
│       └── roles.decorator.ts
└── database/
    └── migrations/
```

---

## خلاصه Endpointها

| # | Method | Endpoint | Auth | توضیح |
|---|--------|----------|------|-------|
| 1 | POST | `/api/auth/register` | - | ثبت‌نام |
| 2 | POST | `/api/auth/login` | - | ورود |
| 3 | POST | `/api/auth/refresh` | - | تمدید توکن |
| 4 | GET | `/api/auth/me` | ✅ | اطلاعات کاربر |
| 5 | PUT | `/api/auth/profile` | ✅ | بروزرسانی پروفایل |
| 6 | PUT | `/api/auth/password` | ✅ | تغییر رمز |
| 7 | POST | `/api/auth/logout` | ✅ | خروج |
| 8 | GET | `/api/products` | - | لیست محصولات |
| 9 | GET | `/api/products/:slug` | - | جزئیات محصول |
| 10 | GET | `/api/menu-categories` | - | لیست منو |
| 11 | GET | `/api/menu-categories/:slug` | - | جزئیات دسته منو |
| 12 | GET | `/api/articles` | - | لیست مقالات |
| 13 | GET | `/api/articles/:slug` | - | جزئیات مقاله |
| 14 | GET | `/api/gallery` | - | لیست گالری |
| 15 | GET | `/api/gallery/:slug` | - | جزئیات گالری |
| 16 | GET | `/api/staffs` | - | لیست کارکنان |
| 17 | GET | `/api/testimonials` | - | لیست نظرات |
| 18 | GET | `/api/profile/addresses` | ✅ | لیست آدرس‌ها |
| 19 | POST | `/api/profile/addresses` | ✅ | ایجاد آدرس |
| 20 | PUT | `/api/profile/addresses/:id` | ✅ | بروزرسانی آدرس |
| 21 | DELETE | `/api/profile/addresses/:id` | ✅ | حذف آدرس |
| 22 | PATCH | `/api/profile/addresses/:id/default` | ✅ | آدرس پیش‌فرض |
| 23 | GET | `/api/profile/favorites` | ✅ | لیست علاقه‌مندی‌ها |
| 24 | POST | `/api/profile/favorites` | ✅ | افزودن علاقه‌مندی |
| 25 | DELETE | `/api/profile/favorites/:productId` | ✅ | حذف علاقه‌مندی |
| 26 | GET | `/api/profile/orders` | ✅ | لیست سفارشات |
| 27 | GET | `/api/profile/orders/:id` | ✅ | جزئیات سفارش |
| 28 | POST | `/api/profile/orders/:id/cancel` | ✅ | درخواست لغو |
| 29 | POST | `/api/profile/orders/:id/return` | ✅ | درخواست مرجوعی |
| 30 | GET | `/api/profile/wallet` | ✅ | موجودی کیف پول |
| 31 | GET | `/api/profile/wallet/transactions` | ✅ | تراکنش‌ها |
| 32 | POST | `/api/profile/wallet/charge` | ✅ | شارژ کیف پول |
| 33 | GET | `/api/profile/support` | ✅ | لیست تیکت‌ها |
| 34 | POST | `/api/profile/support` | ✅ | ایجاد تیکت |
| 35 | POST | `/api/orders/create` | ✅ | ثبت سفارش |
| 36 | POST | `/api/admin/login` | - | ورود ادمین |
| 37 | GET | `/api/admin/dashboard` | 🔒 | داشبورد |
| 38 | GET | `/api/admin/products` | 🔒 | لیست محصولات |
| 39 | POST | `/api/admin/products` | 🔒 | ایجاد محصول |
| 40 | PUT | `/api/admin/products/:id` | 🔒 | ویرایش محصول |
| 41 | DELETE | `/api/admin/products/:id` | 🔒 | حذف محصول |
| 42 | GET | `/api/admin/orders` | 🔒 | لیست سفارشات |
| 43 | PATCH | `/api/admin/orders/:id/status` | 🔒 | تغییر وضعیت |
| 44 | PATCH | `/api/admin/orders/:id/action` | 🔒 | تایید/رد عملیات |
| 45 | PATCH | `/api/admin/orders/:id/tracking` | 🔒 | ثبت کد رهگیری |
| 46 | GET | `/api/admin/users` | 🔒 | لیست کاربران |
| 47 | PATCH | `/api/admin/users/:id/status` | 🔒 | تغییر وضعیت کاربر |
| 48 | GET | `/api/admin/articles` | 🔒 | لیست مقالات |
| 49 | POST | `/api/admin/articles` | 🔒 | ایجاد مقاله |
| 50 | PUT | `/api/admin/articles/:id` | 🔒 | ویرایش مقاله |
| 51 | DELETE | `/api/admin/articles/:id` | 🔒 | حذف مقاله |
| 52 | GET | `/api/admin/gallery` | 🔒 | لیست گالری |
| 53 | POST | `/api/admin/gallery` | 🔒 | افزودن تصویر |
| 54 | DELETE | `/api/admin/gallery/:id` | 🔒 | حذف تصویر |
| 55 | POST | `/api/admin/staff` | 🔒 | ایجاد کارمند |
| 56 | PUT | `/api/admin/staff/:id` | 🔒 | ویرایش کارمند |
| 57 | DELETE | `/api/admin/staff/:id` | 🔒 | حذف کارمند |
| 58 | POST | `/api/admin/testimonials` | 🔒 | ایجاد نظر |
| 59 | PUT | `/api/admin/testimonials/:id` | 🔒 | ویرایش نظر |
| 60 | DELETE | `/api/admin/testimonials/:id` | 🔒 | حذف نظر |
| 61 | GET | `/api/admin/support` | 🔒 | لیست تیکت‌ها |
| 62 | POST | `/api/admin/support/:id/reply` | 🔒 | پاسخ به تیکت |
| 63 | PATCH | `/api/admin/support/:id/status` | 🔒 | تغییر وضعیت تیکت |
| 64 | GET | `/api/admin/menu-categories` | 🔒 | لیست دسته منو |
| 65 | POST | `/api/admin/menu-categories` | 🔒 | ایجاد دسته منو |
| 66 | POST | `/api/admin/menu-items` | 🔒 | ایجاد قلم منو |
| 67 | PUT | `/api/admin/menu-items/:id` | 🔒 | ویرایش قلم منو |
| 68 | DELETE | `/api/admin/menu-items/:id` | 🔒 | حذف قلم منو |
| 69 | GET | `/api/admin/settings` | 🔒 | تنظیمات |
| 70 | PUT | `/api/admin/settings` | 🔒 | بروزرسانی تنظیمات |

> ✅ = نیاز به JWT کاربر عادی
> 🔒 = نیاز به JWT ادمین
