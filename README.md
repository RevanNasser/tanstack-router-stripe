# TanStack Router + Stripe

Demo project showing how to load external scripts (Stripe.js) with TanStack Router head management and build a payment form UI with Stripe Elements.


## Quick start
```bash
npm install
cp env.example .env   # add your Stripe publishable key
npm run dev
```
Open the URL shown by Vite (usually http://localhost:5173).

## Environment variables
- `VITE_STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (test or live).  
  This is read in `PaymentForm` via `import.meta.env`


## Where scripts are loaded
- Stripe is injected through TanStack Router head config in `app/routes/__root.tsx`:
  - `head().scripts` adds `https://js.stripe.com/v3/`
  - `<HeadContent />` renders head/meta/scripts
  - `<Scripts />` renders any body scripts if added

## Testing (Stripe)
- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits



## Scripts
- `npm run dev`     - start Vite dev server
- `npm run build`   - type-check + build
- `npm run preview` - preview the production build

