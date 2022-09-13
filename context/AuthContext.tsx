import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext({})

export const useAuth: any = () => useContext(AuthContext)

export const AuthContextProvider = ({children, }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                })
            } else {
                setUser(null)
            }
            setLoading(false);
        })

        return () => unsubscribe()
    }, [])

    const signup = (email:string, password:string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email:string, password:string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{user, login, signup, logout}}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}