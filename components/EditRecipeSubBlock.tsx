import React, { useState } from 'react'
import type { RecipeStepBlock , Recipe } from '../pages/recipeList';
import EditRecipeSub from './EditRecipeSub'

interface Props {
  setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  recipeStepBlock: RecipeStepBlock;
  tempRecipe: Recipe;
}

const EditRecipeSubBlock: React.FC<Props> = ({ setTempRecipe, recipeStepBlock, tempRecipe }) => {
  const [forStatement, setForStatement] = useState<string>(recipeStepBlock.for)
  const [tempRecipeStepBlock, setTempRecipeStepBlock] = useState<RecipeStepBlock>(recipeStepBlock)

  const listRecipeSteps = recipeStepBlock.steps.map((recipeStep) => {
    return <EditRecipeSub setTempRecipeStepBlock={setTempRecipeStepBlock} recipeStep={recipeStep} recipeStepBlock={recipeStepBlock} key={recipeStep.recipeStepNumber}/>
  })

  const handleAddRecipeStepBlockEdits = () => {
    let tempRecipeStepList = tempRecipe.recipeStepList;
    tempRecipeStepList[recipeStepBlock.blockNumber-1] = tempRecipeStepBlock
    tempRecipeStepList[recipeStepBlock.blockNumber-1].for = forStatement
    setTempRecipe(prev => {
      return {
          ...prev,
          recipeStepList: tempRecipeStepList
      }
    })
  }

  const handleAddTempRecipeStep = () => {
    let tempRecipeAddition = tempRecipeStepBlock;
    tempRecipeAddition.steps.push({ recipeStepNumber: tempRecipeAddition.steps.length+1, recipeStepText: '' })
    setTempRecipeStepBlock(prev => {
        return {
            ...prev,
            steps : tempRecipeAddition.steps
        }
    })
}

const handleDeleteLastRecipeStep = () => {
    let tempRecipeSubtraction = tempRecipeStepBlock;
    tempRecipeSubtraction.steps.pop();
    setTempRecipeStepBlock(prev => {
        return {
          ...prev,
          steps : tempRecipeSubtraction.steps
        }
    })
}

  return (
    <div>
      <input onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={recipeStepBlock.for} />
      {listRecipeSteps}
      <button onClick={handleAddRecipeStepBlockEdits} >Save Changes</button>
      <button onClick={handleAddTempRecipeStep} >Add Step</button>
      <button onClick={handleDeleteLastRecipeStep} >Delete Last Step</button>
    </div>
  )
}

export default EditRecipeSubBlock