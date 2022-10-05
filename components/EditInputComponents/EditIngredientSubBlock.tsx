import { Card, TextField, Tooltip, IconButton, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import type { IngredientBlock, Recipe } from '../../pages/recipeList'
import EditIngredientSub from './EditIngredientSub'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
/*
type IngredientSplit = {
  amount: string;
  name: string;
  unit: string;
} */

interface Props {
  setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>
  ingredientBlock: IngredientBlock;
  tempRecipe: Recipe;
 // splitIngredientArray: IngredientSplit[];
}

const EditIngredientSubBlock: React.FC<Props> = ({ setTempRecipe, ingredientBlock, tempRecipe, /*splitIngredientArray*/ }) => {
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

  useEffect(() => {
    setForStatement(ingredientBlock.for)
  }, [ingredientBlock])

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
/*
const addSplitIngredients = () => {
  let tempIngredientAddition = tempIngredientBlock;
  tempIngredientAddition.ingredients = []
  for (let i = 0; i < splitIngredientArray.length; i++) {
    tempIngredientAddition.ingredients.push({ ingredientAmount: `${splitIngredientArray[i].amount}`, ingredientUnit: `${splitIngredientArray[i].unit}`, ingredientName: `${splitIngredientArray[i].name}`, ingredientId: tempIngredientAddition.ingredients.length+1})
  }
  setTempIngredientBlock(prev => {
      return {
          ...prev,
          steps : tempIngredientAddition.ingredients
      }
  })
} */

  return (
    <Card sx={{ margin: 1, padding: 1}}>
      <TextField size="small" helperText="Ingredient block for..." onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={ingredientBlock.for} />
      <Tooltip title="Add Ingredient">
        <IconButton onClick={handleAddTempIngredient}>
          <AddCircleIcon></AddCircleIcon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Last Ingredient">
         <IconButton onClick={handleDeleteLastIngredient}>
           <RemoveCircleIcon></RemoveCircleIcon>
         </IconButton>
      </Tooltip>
    {/*}  <Button onClick={addSplitIngredients} >Add Split</Button> */}
      {listIngredients}
    </Card>
  )
}

export default EditIngredientSubBlock