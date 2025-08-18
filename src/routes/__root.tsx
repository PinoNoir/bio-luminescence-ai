import {
    Outlet,
    createRootRoute,
  } from '@tanstack/react-router'
  import { DefaultCatchBoundary, NotFound, Navigation } from '../components'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  })

  export const Route = createRootRoute({
    errorComponent: (props) => {
      return (
        <QueryClientProvider client={queryClient}>
          <DefaultCatchBoundary {...props} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      )
    },
    notFoundComponent: () => (
      <QueryClientProvider client={queryClient}>
        <NotFound />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    ),
    component: RootComponent,
  })
  
  function RootComponent() {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-blue-950">
          <Navigation />
          <main>
            <Outlet />
          </main>
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  }
  