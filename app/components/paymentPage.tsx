import { useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ApplePayButton } from './ApplePayButton'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
)

export function PaymentPage() {
  const [stripe, setStripe] = useState<Stripe | null>(null)

  useEffect(() => {
    stripePromise.then(setStripe)
  }, [])

  if (!stripe) return null

  return (
    <Elements stripe={stripe}>
      <ApplePayButton />
    </Elements>
  )
}
