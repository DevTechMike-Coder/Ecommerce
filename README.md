# Premium Next.js 16 E-Commerce Platform

A state-of-the-art e-commerce web application built using **Next.js 16**, **React 19**, **Prisma**, **PostgreSQL (Neon)**, **Better Auth**, and **Stripe**. The project features a premium, animated design utilizing **Tailwind CSS v4** and **Framer Motion**, offering a seamless desktop-to-mobile shopping experience.

---

## 🌟 Core Features

### 🛍️ Shopping Experience
*   **Curated Catalog**: Search and filter products by categories and customized collections.
*   **Persistent Shopping Cart**: A fully reactive client-side cart built using Zustand, integrated with checkout flows.
*   **Database-Backed Wishlist**: Save favorite items to a database-backed wishlist. Instantly add to cart or remove items with smooth slide-and-fade Framer Motion animations.
*   **Secure Stripe Checkout**: Complete checkouts securely via Stripe, supporting real-time webhooks and success confirmations.

### 🔐 Authentication & Accounts
*   **Better Auth Integration**: Secured password credentials and OAuth (Google Login) support.
*   **User Roles**: Role-based access control splitting standard shoppers (`USER`) and administrators (`ADMIN`).
*   **Profile Center**: Customers can manage their credentials and view past order histories.

### 📊 Administrative Dashboard
*   **Metrics Suite**: Dynamic stat cards displaying total settled revenue, completed sales, registered customers, and catalog stock counts.
*   **Interactive Trend Charting**: A custom-drawn, animated SVG line chart plotting daily revenue trends over the last 7 days.
*   **Categorization Distribution**: Real-time progress bars indicating how products are distributed across inventory categories.
*   **Recent Transaction Logs**: A status-pill table logging the most recent transactions, order amounts, and payment statuses.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 16.1 (App Router, React 19)
*   **Database ORM**: Prisma Client 7.5
*   **Database Provider**: PostgreSQL (Neon Serverless)
*   **Authentication**: Better Auth 1.5
*   **Styling & Theming**: Tailwind CSS v4 with custom OKLCH color variables (Indigo-Violet & Cosmic Space Slate theme)
*   **Animations**: Framer Motion 12 & Lucide-react icons
*   **State Management**: Zustand 5 (persistent storage)
*   **Payment Processor**: Stripe API & Elements
*   **Image Storage**: Cloudinary (next-cloudinary)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+ recommended) installed.

### 2. Environment Setup
Create a `.env` file in the root directory (refer to `.env` template values):
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://<user>:<password>@<host>/neondb?sslmode=require
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe credentials
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...

# Cloudinary credentials
CLOUDINARY_URL=cloudinary://...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkp...

# Admin credentials
SETUP_SECRET=your_admin_setup_secret
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Sync
Generate the Prisma client and sync the schema with your serverless PostgreSQL database:
```bash
npx prisma db push
```

### 5. Running the Application
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ Administrative Privilege Setup

To access the Admin Panel at `/admin`:
1.  Sign up for a standard user account on the store.
2.  Run the administrative promotion script in your terminal, providing your account email:
    ```bash
    npx ts-node scripts/promote-admin.ts your-email@example.com
    ```
3.  Refresh your session to load the updated `ADMIN` role.

---

## 📂 Project Architecture

```
├── app/
│   ├── (admin)/            # Admin Panel views & layouts (/admin)
│   ├── (setup)/            # Initial configuration routes
│   ├── (shop)/             # Customer-facing shopping views (Cart, Wishlist, nextHub)
│   ├── api/                # Route handlers (admin stats, user orders, wishlist, Stripe checkout)
│   ├── globals.css         # Styling system & OKLCH color definitions
│   └── layout.tsx          # Root HTML layout and providers wrapper
├── components/
│   ├── adminCom/           # Admin-specific components (App Sidebar)
│   ├── nextHubCom/         # Shop section blocks (Hero, Collections, Newsletter)
│   ├── pagecomponents/     # Layout scaffolding (Navbar, Footer, UserAccountNav)
│   ├── ui/                 # Shadcn/ui core primitives
│   └── uiComponents/       # Premium custom widgets (ProductCard, SVG Chart, Transitions)
├── hooks/                  # Custom react-hooks & Zustand state stores (useCart, useWishlist)
├── lib/                    # Library adapters (Prisma client, Stripe client, Auth wrappers)
├── prisma/                 # Database schema models
└── scripts/                # Utility scripts (Prisma validations, admin promotion tools)
```

---

## 🎨 Visual System & Animations

The platform features a **custom styling system** defined inside `globals.css`:
*   **Color Theme**: Zero-chroma black and white palettes have been replaced by a premium **Indigo-Violet primary color** combined with an elegant **Cosmic Slate-Blue background** in dark mode, and soft slate-white in light mode.
*   **Animations**: Core components utilize `framer-motion` for entry/exit visual effects:
    *   *SVG Chart Line*: Draws the trend line dynamically using `pathLength` motion paths.
    *   *Wishlist cards*: Unmount with layout-reordering and fade-out animations.
    *   *Transitions*: Route pages slide into place, ensuring fluid navigation.
