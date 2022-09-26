import { Card, TextField, Tooltip, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import type { IngredientBlock, Recipe } from '../../pages/recipeList'
import EditIngredientSub from './EditIngredientSub'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'


interface Props {
  setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>
  ingredientBlock: IngredientBlock;
  tempRecipe: Recipe;
}

const EditIngredientSubBlock: React.FC<Props> = ({ setTempRecipe, ingredientBlock, tempRecipe }) => {
  const [forStatement, setForStatement] = useState<string>(ingredientBlock.for)
  const [tempIngredientBlock, setTempIngredientBlock] = useState<IngredientBlock>(ingredientBlock)

  const listIngredients = ingredientBlock.ingredients.map((ingredient) => {
    return <EditIngredientSub setTempIngredientBlock={setTempIngredientBlock} ingredient={ingredient} ingredientBlock={ingredientBlock} key={ingredient.ingredientId}/>
  })

  useEffect(() => {
    let tempIngredientList = tempRecipe.ingredientList;
    tempIngredientList[ingredientBlock.blockNumber] = tempIngredientBlock
    tempIngredientList[ingredientBlock.blockNumber].for = forStatement
    setTempRecipe((prev: Recipe) => {
      return {
          ...prev,
          ingredientList: tempIngredientList
      }
    })
  }, [tempIngredientBlock])

  useEffect(() => {
    setTempIngredientBlock((prev) => {
      return {
        ...prev,
        for: forStatement
      }
    })
  }, [forStatement])

  

  const handleAddTempIngredient = () => {
    let tempIngredientAddition = tempIngredientBlock
    tempIngredientAddition.ingredients.push({ingredientId: tempIngredientBlock.ingredients.length+1, ingredientAmount: '', ingredientName: '', ingredientUnit: ''})
    setTempIngredientBlock(prev => {
        return {
            ...prev,
            ingredients: tempIngredientAddition.ingredients
        }
    })
}

const handleDeleteLastIngredient = () => {
  let tempIngredientSubtraction = tempIngredientBlock;
  tempIngredientSubtraction.ingredients.pop();
  setTempRecipe((prev: Recipe) => {
      return {
          ...prev,
          ingredients: tempIngredientSubtraction.ingredients
      }
  })
}

  return (
    <Card sx={{ margin: 1, padding: 1}}>
      <TextField size="small" helperText="Ingredient block for..." onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={ingredientBlock.for} />
      <Tooltip title="Add Ingredient">
        <IconButton>
          <AddCircleIcon onClick={handleAddTempIngredient}></AddCircleIcon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Last Ingredient">
         <IconButton>
           <RemoveCircleIcon onClick={handleDeleteLastIngredient}></RemoveCircleIcon>
         </IconButton>
      </Tooltip>
      {listIngredients}
    </Card>
  )
}

export default EditIngredientSubBlock