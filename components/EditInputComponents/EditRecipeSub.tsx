import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import type { Recipe, RecipeStep, RecipeStepBlock } from '../../pages/recipeList'

interface Props {
    setTempRecipeStepBlock: React.Dispatch<React.SetStateAction<RecipeStepBlock>>;
    recipeStep: RecipeStep;
    recipeStepBlock: RecipeStepBlock;
}

const EditRecipeSub: React.FC<Props> = ({ setTempRecipeStepBlock, recipeStep, recipeStepBlock }) => {
    const [editedText, setEditedText] = useState<string>(recipeStep.recipeStepText);
    const [tempImg, setTempImg] = useState <File | null>(null)

useEffect(() => {
    let tempArray = recipeStepBlock.steps
        tempArray[recipeStep.recipeStepNumber-1].recipeStepText = editedText;
        setTempRecipeStepBlock(prev => {
            return {
                ...prev,
                steps: tempArray
            }
        });
}, [editedText])

    useEffect(() => {
        setEditedText(recipeStep.recipeStepText)
    }, [recipeStepBlock]) 

  return (
    <div>
        {
            recipeStep.recipeStepType === "file" ?
                <input type="file" onChange={(e: any) => setTempImg(e.target.files[0])}></input> :
                <TextField sx={{width : 490}} onChange={(e) => {setEditedText(e.target.value)}} value={editedText} multiline placeholder={recipeStep.recipeStepText}/> 
        }
    </div>
  )
}

export default EditRecipeSub