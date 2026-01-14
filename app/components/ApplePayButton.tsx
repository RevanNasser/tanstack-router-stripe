import { useEffect, useState } from 'react'
import { useStripe, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import type { PaymentRequest } from '@stripe/stripe-js'

export function ApplePayButton() {
  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] =
    useState<PaymentRequest | null>(null)

  useEffect(() => {
    if (!stripe) return

    const pr = stripe.paymentRequest({
      country: 'AE',
      currency: 'sar',
      total: {
        label: 'Demo Payment',
        amount: 2000, // 20.00 SAR
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.canMakePayment().then((result) => {
      if (result?.applePay) {
        setPaymentRequest(pr)
      }
    })
  }, [stripe])

  if (!paymentRequest) return null

  return (
    <PaymentRequestButtonElement
      options={{
        paymentRequest,
        style: {
          paymentRequestButton: {
            type: 'buy',
            theme: 'dark',
            height: '44px',
          },
        },
      }}
    />
  )
}
