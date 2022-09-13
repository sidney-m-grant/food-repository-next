import React from 'react'
import { Recipe, useRecipeList } from '../context/RecipeListContext'

interface Props{
    recipe: Recipe
}

const IndividualRecipe: React.FC<Props> = ({ recipe }) => {
    const { setCurrentRecipe } = useRecipeList();

  return (
    <>
        <h5>{recipe.recipeName}</h5>
        <button onClick={() => setCurrentRecipe(recipe)}>Set as Current Recipe</button>
    </>
  )
}

export default IndividualRecipe