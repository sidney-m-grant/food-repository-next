import React from 'react'
import { useAuth } from '../../context/AuthContext'

function SignOutButton() {
    const { logout } = useAuth()

    return (
        <div>
            <button onClick={() => {logout()}}>Sign Out</button>
        </div>
    )
}

export default SignOutButton