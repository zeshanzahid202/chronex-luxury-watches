# CHRONEX

A fictional luxury watch storefront and commerce foundation built with Next.js App Router, TypeScript, MongoDB/Mongoose, signed HttpOnly sessions, bcrypt password hashing, and Zod request validation.

## Run locally

1. Install Node.js 20.9+ and MongoDB Atlas or a local MongoDB replica set.
2. Copy `.env.example` to `.env.local`; set `MONGODB_URI`, a random `AUTH_SECRET` of at least 32 characters, and `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
3. Run `npm install`, `npm run seed`, then `npm run dev`.
4. Visit `http://localhost:3000`.

The catalog preview falls back to a small, clearly fictional in-code sample while MongoDB is unavailable. Public product APIs and storefront pages use MongoDB when configured. Run the seed command to insert the sample watches into the database.

## Commerce and security status

- Product data is stored in MongoDB and product prices are integer minor units (USD cents). The browser cart stores only product slugs and display details; checkout reloads products and prices from MongoDB.
- Customer accounts use bcrypt hashes and signed, seven-day, HttpOnly, SameSite=Lax cookies. Admin authorization is role based. Configure `ADMIN_EMAIL` and a 12+ character `ADMIN_PASSWORD`, then run `npm run create-admin` to create or promote the admin account.
- Checkout is deliberately sandbox-only. It can create a **pending, unpaid** order after rechecking product and stock and reserving stock transactionally for 15 minutes. Expired holds are released during the next checkout, and an admin can cancel an unpaid order to release its hold. No scheduled expiry worker is configured. It does not accept payment, mark payment successful, fulfill orders, or claim a transaction occurred. No payment provider, verified webhook, refund flow, mail service, upload pipeline, or live tax/shipping calculation is configured.
- MongoDB multi-document transactions require Atlas or a replica set. The checkout route uses a transaction for order creation; connect to a replica set before enabling that route.
- Do not accept real orders or collect customer data until merchant identity, policies, privacy terms, payment provider, webhook verification, inventory reservation/release, operational monitoring, and deployment secrets are configured and reviewed.
- All watch names, editorial, prices, specifications, and brand content are fictional development examples. No certification, manufacturing heritage, review, authenticity, or warranty claim is made.

## Included

- Cinematic responsive homepage, collection and product pages, search, journal, editorial and legal pages.
- Product listing/search API, account registration/login/logout, customer order history API, cart and checkout UI, pending sandbox order persistence.
- Protected admin overview, read-only order view, product create API, guarded fulfillment status API.
- MongoDB schemas for products, users, orders, articles, and collections.

## Not yet implemented

The master brief describes a production-scale commerce platform. This initial workspace implementation is a foundation, not production-ready: Auth.js integration, password reset, persisted user carts and wishlists, scheduled reservation expiry, real hosted payment adapters and signed webhooks, refunds, tax and shipping configuration, Cloudinary uploads, rich-text CMS, full admin CRUD/modules, rate limiting, audit logging, transactional email, full editorial CMS and complete automated test coverage remain to be built. The policy pages are clearly marked sample copy. No test suite is included yet.

## Commands

- `npm run dev` — local app
- `npm run typecheck` — TypeScript check
- `npm run build` — production build
- `npm run seed` — insert fictional sample products
- `npm run create-admin` — provision the configured administrator account

Before deployment, use a Vercel environment with production MongoDB replica-set/Atlas, strong secrets, and an explicitly configured, verified payment integration. Never switch payment mode to live without completing those integrations.
