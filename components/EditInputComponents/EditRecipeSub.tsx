import React, { useEffect, useState } from 'react'
import type { Recipe, RecipeStep, RecipeStepBlock } from '../../pages/recipeList'

interface Props {
    setTempRecipeStepBlock: React.Dispatch<React.SetStateAction<RecipeStepBlock>>;
    recipeStep: RecipeStep;
    recipeStepBlock: RecipeStepBlock;
}

const EditRecipeSub: React.FC<Props> = ({ setTempRecipeStepBlock, recipeStep, recipeStepBlock }) => {
    const [editedText, setEditedText] = useState<string>(recipeStep.recipeStepText)

useEffect(() => {
    let tempArray = recipeStepBlock.steps
        tempArray[recipeStep.recipeStepNumber-1].recipeStepText = editedText;
        setTempRecipeStepBlock(prev => {
            return {
                ...prev,
                steps: tempArray
            }
        })
}, [editedText])

    useEffect(() => {
        setEditedText(recipeStep.recipeStepText)
    }, [recipeStepBlock]) 

  return (
    <div>
        <input onChange={(e) => {setEditedText(e.target.value)}} value={editedText} placeholder={recipeStep.recipeStepText}/>
    </div>
  )
}

export default EditRecipeSub