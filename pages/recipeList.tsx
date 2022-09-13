import React from 'react'
import SignOutButton from '../components/SignOutButton'
import { Router, useRouter } from 'next/router'

const RecipeList = () => {
    const router = useRouter()
    return (
        <div>
            <SignOutButton />
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
        </div>
    )
}

export default RecipeList
