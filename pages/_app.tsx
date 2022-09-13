import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRouter } from 'next/router'
import { RecipeListContextProvider } from '../context/RecipeListContext'

const noAuthRequired = ['/signIn']

function MyApp({ Component, pageProps }: AppProps) {
  
  const router = useRouter()
  
  return (
    
   <AuthContextProvider>
      <RecipeListContextProvider>
        {/* this ternary operator applies the protect route component to anything not including in the noAuthRequired Array defined above
        , rerouting back to signIn whenever someone goes to a protected path
        - currently causing an error when trying to go to same URL */}
        {noAuthRequired.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        )
      }
     </RecipeListContextProvider>
   </AuthContextProvider>
    
  )
}

export default MyApp
