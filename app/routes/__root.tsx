import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import '../index.css'

export const Route = createRootRoute({
  head: () => ({
    title: 'TanStack Router - Stripe Integration',
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    ],
    scripts: [
      {
        src: 'https://js.stripe.com/v3/',
      },
    
    ],
  }),

  component: () => (
    <>
      <HeadContent />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </div>
      <Scripts />
    </>
  ),
})

