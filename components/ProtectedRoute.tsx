import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { user } = useAuth()
    const router = useRouter()

    // basic use effect sends us back to login if no one is signed in

    useEffect(() => {
        if(!user) {
            router.push('/signIn')
        }
    }, [router, user])

    return (
        <>{user ? children : null}</>
    )
}

export default ProtectedRoute