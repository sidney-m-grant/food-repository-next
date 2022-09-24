import React, { useState } from 'react'
import type { IngredientBlock, Recipe } from '../../pages/recipeList'
import EditIngredientSub from './EditIngredientSub'

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

  const handleAddIngredientBlockEdits = () => {
    let tempIngredientList = tempRecipe.ingredientList;
    tempIngredientList[ingredientBlock.blockNumber] = tempIngredientBlock
    tempIngredientList[ingredientBlock.blockNumber].for = forStatement
    setTempRecipe((prev: Recipe) => {
      return {
          ...prev,
          ingredientList: tempIngredientList
      }
    })
  }

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
    <div>
      <input onChange={(e) => setForStatement(e.target.value)} value={forStatement} placeholder={ingredientBlock.for} />
      {listIngredients}
      <button onClick={handleAddIngredientBlockEdits} >Save Changes</button>
      <button onClick={handleAddTempIngredient} >Add Ingredient</button>
      <button onClick={handleDeleteLastIngredient} >Delete Last Ingredient</button>
    </div>
  )
}

export default EditIngredientSubBlock