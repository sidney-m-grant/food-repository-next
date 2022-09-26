import { Card, IconButton, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import type { RecipeStepBlock , Recipe } from '../../pages/recipeList';
import EditRecipeSub from './EditRecipeSub'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

interface Props {
  setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>
  recipeStepBlock: RecipeStepBlock;
  tempRecipe: Recipe;
}

const EditRecipeSubBlock: React.FC<Props> = ({ setTempRecipe, recipeStepBlock, tempRecipe }) => {
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
          recipeStepList: tempRecipeStepList
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
    <Card sx={{ margin: 1, padding: 1}}>
      <TextField size="small" helperText="Recipe steps for..." onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={recipeStepBlock.for} />
      <Tooltip title="Add Step">
        <IconButton>
          <AddCircleIcon onClick={handleAddTempRecipeStep}></AddCircleIcon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Last Step">
         <IconButton>
           <RemoveCircleIcon onClick={handleDeleteLastRecipeStep}></RemoveCircleIcon>
         </IconButton>
      </Tooltip>
      
      
      {listRecipeSteps}
    </Card>
  )
}

export default EditRecipeSubBlock