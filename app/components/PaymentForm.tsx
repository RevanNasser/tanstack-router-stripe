import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    Stripe: any
  }
}

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY


export default function PaymentForm() {
  const [stripe, setStripe] = useState<any>(null)
  const [elements, setElements] = useState<any>(null)
  const [cardElement, setCardElement] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [amount, setAmount] = useState('49.00')
  const cardElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    let card: any = null

    const initStripe = () => {
      if (typeof window !== 'undefined' && window.Stripe) {
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

          if (cardElementRef.current && card) {
            try {
              card.mount(cardElementRef.current)
              setCardElement(card)

              card.on('change', (event: any) => {
                if (event.error) {
                  setError(event.error.message)
                } else {
                  setError(null)
                }
              })
            } catch (err) {
              console.error('Error mounting Stripe card element:', err)
            }
          } else if (mounted) {
            setTimeout(mountCard, 120)
          }
        }

        mountCard()
      } else if (mounted) {
        setTimeout(initStripe, 100)
      }
    }

    initStripe()

    return () => {
      mounted = false
      if (card) {
        try {
          card.unmount()
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (!cardElement) return

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      if (cardElement) {
        cardElement.update({
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
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [cardElement])

  const handleSubmit = async () => {
    setStatus('idle')
    setError(null)
    setLoading(true)

    if (!stripe || !elements || !cardElement) {
      setError('Stripe has not loaded yet')
      setLoading(false)
      return
    }

    try {
      const { error: createError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (createError) {
        setError(createError.message)
        setStatus('error')
        setLoading(false)
        return
      }

      setStatus('success')
      setTimeout(() => {
        if (cardElement) {
          cardElement.clear()
        }
        setStatus('idle')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Form</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stripe Elements loaded via TanStack Router head() function
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Payment method created successfully
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Information  <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">Stripe SDK</code>
            </label>
            <div
              ref={cardElementRef}
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[50px] transition-all"
            />
            {!stripe && (
              <div className="flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Loading Stripe SDK...
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!stripe || loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              `Pay $${amount || '0.00'}`
            )}
          </button>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Test Card
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Number</span>
                <code className="block px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-gray-100">
                  4242 4242 4242 4242
                </code>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">Expiry</span>
                <code className="block px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-gray-100">
                  12/34
                </code>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block mb-1">CVC</span>
                <code className="block px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono text-gray-900 dark:text-gray-100">
                  123
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
