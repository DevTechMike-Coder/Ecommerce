# Next Hub Ecommerce: Threat Model

Scope: `main` branch. Status: ✅ implemented · ⚠️ partial / documented gap · 🔲 planned.

## 1. System overview

Next.js 16 storefront and admin panel. Authentication via `better-auth` (email/password + Google) on PostgreSQL through Prisma; payments through Stripe Checkout plus cash-on-delivery; images via Cloudinary. Authorization is enforced in route handlers (`app/api/**`) with helpers in `lib/auth-utils.ts`. There is no `proxy.ts`/middleware layer, so **every route handler must perform its own check**.

## 2. Assets

Customer accounts and addresses, orders and payment state, product catalogue integrity and stock levels, admin access, Stripe and auth secrets.

## 3. Actors

Anonymous visitor · customer attacking another customer's orders/wishlist (primary adversary) · customer attempting to reach admin functionality · attacker tampering with prices, quantities, or payment confirmation.

## 4. Controls and status

| Threat | Control | Status | Evidence |
|---|---|---|---|
| Price/total tampering | Prices are read from the database per product id at checkout; the client supplies only product ids and quantities. Stock is checked server-side | ✅ | `lib/checkout.ts` |
| Money handling errors | Amounts rounded and stored as `Prisma.Decimal` | ✅ | `lib/checkout.ts` `toDecimal()` |
| Reading/cancelling another customer's order (IDOR) | Order queries are scoped with `userId: session.user.id` in the `where` clause; cancellation uses a compare-and-set `updateMany` on the expected status to prevent races | ✅ | `app/api/user/orders/[id]/route.ts` |
| Paying for one user, confirming for another | Confirm endpoint retrieves the Stripe session server-side, rejects a session whose `metadata.userId` differs from the caller, and requires `payment_status === "paid"` | ✅ | `app/api/checkout/stripe/confirm/route.ts` |
| Customer reaching admin APIs | Every admin and catalogue-mutation handler calls `isAdmin()` before doing work (stats, orders, customers, categories, product create/update/delete) | ✅ | `app/api/admin/**`, `app/api/products/**`, `app/api/categories/route.ts` |
| Order status abuse by admin input | Admin status changes validated against an allowlist; stock is restored inside a transaction on cancel | ✅ | `app/api/admin/orders/[id]/route.ts` |
| First-admin takeover | Setup endpoint refuses once any ADMIN exists and requires a `SETUP_SECRET` | ⚠️ one-time bootstrap path remains in production | `app/api/admin/setup/route.ts` |
| Injection | Prisma parameterization; no raw SQL and no `dangerouslySetInnerHTML` in `app/`, `components/`, `lib/` | ✅ | grep of source |
| Stripe API usage | Secret key read from env, client created lazily, server-only | ✅ | `lib/stripe.ts` |
| Browser hardening | No security headers or CSP configured in `next.config.ts` | 🔲 | `next.config.ts` |
| Brute force / abuse | No application-level rate limiting on auth, checkout, reviews, or setup | 🔲 | n/a |
| Payment completion without webhooks | Completion relies on the redirect-time confirm call; there is no Stripe webhook handler for asynchronous events (refunds, disputes, abandoned redirects) | ⚠️ | `app/api/checkout/**` |
| Transactional email | Password-reset email delivery is not wired to a provider yet | ⚠️ | `lib/auth.ts` |

## 5. Assumptions / out of scope

Stripe, Cloudinary, and better-auth platform security; deployment environment variables being set and kept secret.

## 6. Roadmap

1. Add `proxy.ts` to gate `/admin/**` pages and `/api/admin/**` by default, so a forgotten per-route check fails closed.
2. Add rate limiting (auth, setup, checkout, reviews) and security headers with a CSP.
3. Add a Stripe webhook with signature verification as the source of truth for payment state.
4. Wire a real email provider for password reset and email verification.
5. Add tests for the order/wishlist IDOR cases and for admin-route denial as a non-admin; enable CodeQL and Dependabot.
6. Remove or disable the one-time admin setup route after bootstrap.
