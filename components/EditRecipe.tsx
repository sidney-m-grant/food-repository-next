import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStep, Ingredient } from '../pages/recipeList'
import EditIngredientSub from './EditIngredientSub'
import EditRecipeSub from './EditRecipeSub'

interface Props {
  editedRecipe: Recipe
}

const EditRecipe: React.FC<Props> = ({ editedRecipe }) => {

    const [tempRecipe, setTempRecipe] = useState<Recipe>(editedRecipe)

    const listRecipeSteps = editedRecipe.recipeStepList.map((recipeStep) => {
        return <EditRecipeSub setTempRecipe={setTempRecipe} recipeStep={recipeStep} recipe={editedRecipe} key={recipeStep.recipeStepNumber}/>
    })

    const listIngredients = editedRecipe.ingredientList.map((ingredient) => {
        return <EditIngredientSub setTempRecipe={setTempRecipe} ingredient={ingredient} recipe={editedRecipe} key={ingredient.ingredientId}/>
    })

  return (
    <div className="recipe-container">
        {editedRecipe.recipeName}
        <div className="ingredient-list">
            {listIngredients}
        </div>
        <div className="recipe-steps">
            {listRecipeSteps}
        </div>
    </div>
  )
}

export default EditRecipe