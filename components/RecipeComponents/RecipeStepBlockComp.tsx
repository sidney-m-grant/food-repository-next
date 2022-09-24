import React, { useState } from 'react'
import type { RecipeStepBlock, Recipe, RecipeStep } from '../../pages/recipeList'

interface Props{
    stepBlock: RecipeStepBlock;
    recipeStepList: RecipeStepBlock[]
}

const RecipeStepBlockComp: React.FC<Props> = ({ stepBlock, recipeStepList }) => {
  
  const listRecipeSteps = stepBlock.steps.map((item: RecipeStep) => {
    return <h5 key={item.recipeStepNumber}>{item.recipeStepNumber}. {item.recipeStepText}</h5>
}) 

  return (
    <div>
      {`${stepBlock.for }`}
      {listRecipeSteps}
    </div>
  )
}

export default RecipeStepBlockComp