import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    stripe: any
  }
}

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

type PaymentMethod = 'card' | 'apple_pay'

export default function PaymentForm() {
  const [stripe, setStripe] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)
  const [cardElement, setCardElement] = useState<any>(null)

  const [method, setMethod] = useState<PaymentMethod>('card')
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [applePayAvailable, setApplePayAvailable] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [amount, setAmount] = useState('49.00')

  const cardElementRef = useRef<HTMLDivElement>(null)
  const applePayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    let card: any = null

    const initStripe = () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY)
        setStripe(stripeInstance)

        const elementsInstance = stripeInstance.elements()
        setElements(elementsInstance)

        const isDark = document.documentElement.classList.contains('dark')

        card = elementsInstance.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: isDark ? '#f1f5f9' : '#0f172a',
              '::placeholder': {
                color: isDark ? '#64748b' : '#94a3b8',
              },
            },
            invalid: {
              color: '#dc2626',
            },
          },
        })

        const mountCard = () => {
          if (!mounted) return
          if (cardElementRef.current) {
            card.mount(cardElementRef.current)
            setCardElement(card)

            card.on('change', (event: any) => {
              setError(event.error?.message ?? null)
            })
          } else {
            setTimeout(mountCard, 100)
          }
        }

        mountCard()
      } else {
        setTimeout(initStripe, 100)
      }
    }

    initStripe()

    return () => {
      mounted = false
      try {
        card?.unmount()
      } catch {}
    }
  }, [])

 
  useEffect(() => {
    if (!stripe) return

    const pr = stripe.paymentRequest({
      country: 'AE',
      currency: 'sar',
      total: {
        label: 'Demo Payment',
        amount: Math.round(Number(amount) * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.canMakePayment().then((result: any) => {
      if (result?.applePay) {
        setPaymentRequest(pr)
        setApplePayAvailable(true)
      } else {
        setApplePayAvailable(false)
      }
    })
  }, [stripe, amount])

  useEffect(() => {
    if (!paymentRequest || !applePayRef.current || !stripe) return

    const prButton = stripe.elements().create('paymentRequestButton', {
      paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'buy',
          theme: 'black',
          height: '44px',
        },
      },
    })

    prButton.mount(applePayRef.current)

    paymentRequest.on('paymentmethod', () => {
      setStatus('success')
    })

    return () => {
      try {
        prButton.unmount()
      } catch {}
    }
  }, [paymentRequest])


  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        setError(error.message)
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Payment Demo
      </h2>

      {/* Payment Method Switch */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMethod('card')}
          className={`flex-1 py-2 rounded-lg font-medium ${
            method === 'card'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Card
        </button>

        <button
          onClick={() => setMethod('apple_pay')}
          className={`flex-1 py-2 rounded-lg font-medium ${
            method === 'apple_pay'
              ? 'bg-black text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Apple Pay
        </button>
      </div>

      {/* Amount */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
      />

      {/* Card */}
      {method === 'card' && (
        <>
          <div
            ref={cardElementRef}
            className="p-4 border rounded-lg mb-4 bg-white dark:bg-gray-700"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Pay ${amount}
          </button>
        </>
      )}

      {/* Apple Pay */}
      {method === 'apple_pay' && (
        <div>
          {applePayAvailable ? (
            <div ref={applePayRef} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apple Pay is not available on this device or browser.
            </p>
          )}
        </div>
      )}

      {/* Status */}
      {status === 'success' && (
        <p className="mt-6 text-green-600 font-semibold">
          Payment successful
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-600 font-semibold">
          {error}
        </p>
      )}
    </div>
  )
}
