import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@mui/material'

function SignOutButton() {
    const { logout } = useAuth()

    return (
        <div>
            <Button onClick={() => {logout()}}>Sign Out</Button>
        </div>
    )
}

export default SignOutButton