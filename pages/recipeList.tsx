import React, { useState, useEffect } from 'react'
import SignOutButton from '../components/SignOutButton'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { RecipeStep, Ingredient, Recipe, useRecipeList } from '../context/RecipeListContext'

export const RecipeList = () => {

    const router = useRouter()

    const { allRecipes } = useRecipeList();

    const listItems = allRecipes.map((item: Recipe) => {
        return <h5 key={item.recipeId}>{item.recipeName}</h5>
    })

    return (
        <div>
            <SignOutButton />
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
            {listItems}
        </div>
    )
}

export default RecipeList
