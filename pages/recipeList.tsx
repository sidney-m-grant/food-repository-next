import React, { useState, useEffect } from 'react'
import SignOutButton from '../components/SignOutButton'
import { useRouter } from 'next/router'
import { Recipe, useRecipeList } from '../context/RecipeListContext'
import CurrentRecipe from '../components/CurrentRecipe'
import IndividualRecipe from '../components/IndividualRecipe'

export const RecipeList = () => {

    const router = useRouter()

    const { allRecipes, currentRecipe } = useRecipeList();

    const listItems = allRecipes.map((recipe: Recipe) => {
        return <IndividualRecipe recipe={recipe} key={recipe.recipeId} />
    })

    return (
        <div>
            {currentRecipe ? <CurrentRecipe /> : null}
            <SignOutButton />
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
            {listItems}
        </div>
    )
}

export default RecipeList
