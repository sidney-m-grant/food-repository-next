import React from 'react'
import type { Recipe, RecipeStep, Ingredient } from '../pages/recipeList'

interface Props {
  currentRecipe: Recipe
}

const CurrentRecipe: React.FC<Props> = ({ currentRecipe }) => {

    const listRecipeSteps = currentRecipe.recipeStepList.map((item: RecipeStep) => {
        return <h5 key={item.recipeStepNumber}>{item.recipeStepNumber}. {item.recipeStepText}</h5>
    }) 

    const listIngredients = currentRecipe.ingredientList.map((ingredient: Ingredient) => {
        return <h5 key={ingredient.ingredientId}>{ingredient.ingredientName} {ingredient.ingredientUnit} {ingredient.ingredientAmount}</h5>
    }) 

  return (
    <div>
        {currentRecipe.recipeName}
        {listRecipeSteps}
        {listIngredients}
    </div>
  )
}

export default CurrentRecipe