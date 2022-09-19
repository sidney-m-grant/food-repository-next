import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { setDoc, doc, } from 'firebase/firestore'
import { db } from '../firebase'

export default function signIn() {
    const { user, signup, login, logout } = useAuth()

    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const router = useRouter();

    const registerNewUser = async () => {
        try {
            await signup(registerEmail, registerPassword)
            const socialCollection = {
                name: 'social'
            }
            const recipeCollection = {
                name: 'recipe'
            }
            const friendRequestArray = {
                friendRequests: []
            }
            const friendListArray = {
                friendList: []
            }
            await setDoc(doc(db, registerEmail, "social"), socialCollection)
            await setDoc(doc(db, registerEmail, "social", "socialItems", "friendRequestArray"), friendRequestArray)
            await setDoc(doc(db, registerEmail, "social", "socialItems", "friendListArray"), friendListArray)
            await setDoc(doc(db, registerEmail, "recipeCollection"), recipeCollection)
            router.push('/recipeList')
        } catch(error) {
            console.log(error)
        }
    }

    const signIn = async () => {
        try {
            await login(loginEmail, loginPassword)
            console.log(user)
            router.push('/recipeList')
        } catch(error) {
            console.log(error)
        }
    }

    const alreadySignedIn = () => {
        if (user) {
            router.push('/recipeList')
        } else {
            console.log('not signed in')
        }
    }

  return (
    <div>
        <div>
            {user?.email ? user.email : "not signed in"}
        </div>
        <div>
            <h3>Register New User</h3>
            <input placeholder="Email" onChange={(e) => {
                setRegisterEmail(e.target.value)
            }}></input>
            <input placeholder="Password" onChange={(e) => {
                setRegisterPassword(e.target.value)
            }}></input>
            <button onClick={registerNewUser}>Register</button>
        </div>

        <div>
            <h3>Sign In</h3>
            <input placeholder="Email" onChange={(e) => {
                setLoginEmail(e.target.value)
            }}></input>
            <input placeholder="Password" onChange={(e) => {
                setLoginPassword(e.target.value)
            }}></input>
            <button onClick={signIn}>Sign In</button>
        </div>

        <button onClick={() => {logout()}}>Sign Out</button>

        <button onClick={alreadySignedIn}>Already Signed In</button>
        
     </div>
  )
}

