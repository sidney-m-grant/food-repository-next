import React from 'react'
import type { Recipe } from '../pages/recipeList'

interface Props{
    recipe: Recipe
    setCurrentRecipe: React.Dispatch<React.SetStateAction<Recipe | undefined>>
}

const IndividualRecipe: React.FC<Props> = ({ recipe, setCurrentRecipe }) => {

  return (
    <div className="individual-recipe">
        <h5 style={{ display: 'inline-block' }}>{recipe.recipeName}</h5>
        <button onClick={() => setCurrentRecipe(recipe)}>Set as Current Recipe</button>
    </div>
  )
}

export default IndividualRecipe