import { Card, IconButton, TextField, Tooltip, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import type { RecipeStepBlock , Recipe } from '../../pages/recipeList';
import EditRecipeSub from './EditRecipeSub'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

interface Props {
  setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  recipeStepBlock: RecipeStepBlock;
  tempRecipe: Recipe;
  splitArray: string[];

}

const EditRecipeSubBlock: React.FC<Props> = ({ setTempRecipe, recipeStepBlock, tempRecipe, splitArray }) => {
  const [forStatement, setForStatement] = useState<string>(recipeStepBlock.for)
  const [tempRecipeStepBlock, setTempRecipeStepBlock] = useState<RecipeStepBlock>(recipeStepBlock)

  const listRecipeSteps = recipeStepBlock.steps.map((recipeStep) => {
    return <EditRecipeSub setTempRecipeStepBlock={setTempRecipeStepBlock} recipeStep={recipeStep} recipeStepBlock={recipeStepBlock} key={recipeStep.recipeStepNumber}/>
  })

  useEffect(() => {
    let tempRecipeStepList = tempRecipe.recipeStepList;
    tempRecipeStepList[recipeStepBlock.blockNumber] = tempRecipeStepBlock
    tempRecipeStepList[recipeStepBlock.blockNumber].for = forStatement
    setTempRecipe((prev: Recipe) => {
      return {
          ...prev,
          recipeStepList: tempRecipeStepList,
      }
    })
  }, [tempRecipeStepBlock])

  useEffect(() => {
    setTempRecipeStepBlock((prev) => {
      return {
        ...prev,
        for: forStatement
      }
    })
  }, [forStatement])

  useEffect(() => {
    setForStatement(recipeStepBlock.for)
  }, [recipeStepBlock])

  const handleAddTempRecipeStep = () => {
    let tempRecipeAddition = tempRecipeStepBlock;
    tempRecipeAddition.steps.push({ recipeStepNumber: tempRecipeAddition.steps.length+1, recipeStepText: '', recipeStepType: 'text' })
    setTempRecipeStepBlock(prev => {
        return {
            ...prev,
            steps : tempRecipeAddition.steps
        }
    })
}

const handleAddTempRecipeStepImg = () => {
  let tempRecipeAddition = tempRecipeStepBlock;
    tempRecipeAddition.steps.push({ recipeStepNumber: tempRecipeAddition.steps.length+1, recipeStepText: 'image', recipeStepType: 'file' })
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

const addSplitRecipeSteps = () => {
  let tempRecipeAddition = tempRecipeStepBlock;
  tempRecipeAddition.steps = []
  for (let i = 0; i < splitArray.length; i++) {
    tempRecipeAddition.steps.push({ recipeStepNumber: tempRecipeAddition.steps.length+1, recipeStepText: `${splitArray[i]}`, recipeStepType: 'text' })
  }
  setTempRecipeStepBlock(prev => {
      return {
          ...prev,
          steps : tempRecipeAddition.steps
      }
  })
}

  return (
    <Card sx={{ margin: 1, padding: 1}}>
      <TextField size="small" helperText="Recipe steps for..." onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={recipeStepBlock.for} />
      <Tooltip title="Add Step">
        <IconButton onClick={handleAddTempRecipeStep}>
          <AddCircleIcon></AddCircleIcon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Last Step">
         <IconButton onClick={handleDeleteLastRecipeStep}>
           <RemoveCircleIcon></RemoveCircleIcon>
         </IconButton>
      </Tooltip>
      <Button onClick={addSplitRecipeSteps} >Add Split</Button>
      <Button onClick={handleAddTempRecipeStepImg} >Add Image</Button>
      {listRecipeSteps}
    </Card>
  )
}

export default EditRecipeSubBlock