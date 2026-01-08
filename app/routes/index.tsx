import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import PaymentForm from '../components/PaymentForm'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})




export default function IndexComponent() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('demo')

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 transition-all duration-500">
    <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-200"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 border border-blue-200 dark:border-blue-800">
            <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
              TanStack Router + Stripe.js
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            External Scripts in TanStack Router
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Loading third-party SDKs using TanStack Router's head() function
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
            {['demo', 'setup', 'structure'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab === 'demo' ? 'Demo' : tab === 'setup' ? 'Setup' : 'Structure'}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {activeTab === 'demo' && <PaymentForm />}

          {activeTab === 'setup' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Start
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Configure __root.tsx
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add the Stripe script using <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">head().scripts</code> property
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Environment Variables
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Store your Stripe publishable key in <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">.env</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Initialize Elements
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Wait for <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">window.Stripe</code> to load before creating Elements
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Build Your Form
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create your payment form component with proper error handling
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
 
 {activeTab === 'structure' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
<div className="flex items-center gap-2">
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
    Project Structure
  </h3>

  <div className="relative group">
    <span className="cursor-pointer text-gray-400">ⓘ</span>

    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max
      rounded-md bg-gray-900 text-white text-xs px-3 py-1
      opacity-0 group-hover:opacity-100 transition-opacity">
      Hover over the files to see the comments
    </div>
  </div>
</div>

              
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-6 font-mono text-sm overflow-x-auto border border-gray-200 dark:border-gray-800">
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors">
                    <span className="text-blue-600 dark:text-blue-400">app/</span>
                  </div>
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors">
                    <span className="text-gray-400 dark:text-gray-600">├──</span>
                    <span className="text-purple-600 dark:text-purple-400">routes/</span>
                  </div>
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors group">
                    <span className="text-gray-400 dark:text-gray-600">│   ├──</span>
                    <span className="text-green-600 dark:text-green-400">__root.tsx</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      ← Stripe.js loads here
                    </span>
                  </div>
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors">
                    <span className="text-gray-400 dark:text-gray-600">│   └──</span>
                    <span className="text-gray-700 dark:text-gray-300">index.tsx</span>
                  </div>
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors">
                    <span className="text-gray-400 dark:text-gray-600">└──</span>
                    <span className="text-purple-600 dark:text-purple-400">components/</span>
                  </div>
                  <div className="flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-900 px-2 py-1 rounded transition-colors group">
                    <span className="text-gray-400 dark:text-gray-600">    └──</span>
                    <span className="text-orange-600 dark:text-orange-400">PaymentForm.tsx</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      ← Stripe Elements UI
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">__root.tsx</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Loads Stripe.js script via <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">head().scripts</code>
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">PaymentForm.tsx</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Initializes Stripe Elements and handles payment logic
                  </p>
                </div>
              </div>
            </div>
          )}        </div>
      </div>
    </div>
  )
}