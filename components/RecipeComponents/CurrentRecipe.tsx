import React from 'react'
import type { Recipe, RecipeStep, Ingredient, RecipeStepBlock, IngredientBlock } from '../../pages/recipeList'
import RecipeStepBlockComp from './RecipeStepBlockComp'
import IngredientBlockComp from './IngredientBlockComp'

interface Props {
  currentRecipe: Recipe
}

const CurrentRecipe: React.FC<Props> = ({ currentRecipe }) => {

    const listRecipeSteps = currentRecipe.recipeStepList.map((stepBlock: RecipeStepBlock) => {
      return <RecipeStepBlockComp key={currentRecipe.recipeStepList.indexOf(stepBlock)} stepBlock={stepBlock} recipeStepList={currentRecipe.recipeStepList} />
    })
    
    const listIngredients = currentRecipe.ingredientList.map((ingBlock: IngredientBlock) => {
      return <IngredientBlockComp key={currentRecipe.ingredientList.indexOf(ingBlock)} ingBlock={ingBlock} ingredientList={currentRecipe.ingredientList} />
    })

  return (
    <div className="recipe-container">
        {currentRecipe.recipeName}
        {currentRecipe.imgPath ? 
          <img style={{height: 150, width: 150}} src={currentRecipe.imgPath}></img> : 
          null
        }
        <div className="ingredient-list">
          {listIngredients}
        </div>
        <div className="recipe-steps">
          {listRecipeSteps}
        </div>
    </div>
  )
}

export default CurrentRecipe