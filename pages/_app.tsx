import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { useRouter } from 'next/router'
import { createTheme, ThemeProvider } from '@mui/material'

const noAuthRequired = ['/signIn']

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  
  const router = useRouter()
  
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
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
     </AuthContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
