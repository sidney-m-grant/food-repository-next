import { TextField } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { Ingredient, IngredientBlock } from '../../pages/recipeList';

interface Props {
    setTempIngredientBlock: React.Dispatch<React.SetStateAction<IngredientBlock>>
    ingredient: Ingredient;
    ingredientBlock: IngredientBlock;
}

const EditIngredientSub: React.FC<Props> = ({ setTempIngredientBlock, ingredient, ingredientBlock }) => {
    const [editedName, setEditedName] = useState<string>(ingredient.ingredientName)
    const [editedAmount, setEditedAmount] = useState<string>(ingredient.ingredientAmount)
    const [editedUnit, setEditedUnit] = useState<string>(ingredient.ingredientUnit)

    useEffect(() => {
        let tempArray = ingredientBlock.ingredients
        tempArray[ingredient.ingredientId-1].ingredientName = editedName;
        tempArray[ingredient.ingredientId-1].ingredientAmount = editedAmount;
        tempArray[ingredient.ingredientId-1].ingredientUnit = editedUnit;
        setTempIngredientBlock(prev => {
            return {
                ...prev,
                ingredientList: tempArray
            }
        })
    }, [editedName, editedAmount, editedUnit])

    useEffect(() => {
        setEditedName(ingredient.ingredientName)
        setEditedAmount(ingredient.ingredientAmount)
        setEditedUnit(ingredient.ingredientUnit)
    }, [ingredientBlock]) 

  return (
    <div>
        <TextField helperText="name" onChange={(e) => {setEditedName(e.target.value)}} value={editedName} placeholder={ingredient.ingredientName}></TextField>
        <TextField helperText="amount" onChange={(e) => {setEditedAmount(e.target.value)}} value={editedAmount} placeholder={ingredient.ingredientAmount}></TextField>
        <TextField helperText="unit" onChange={(e) => {setEditedUnit(e.target.value)}} value={editedUnit} placeholder={ingredient.ingredientUnit}></TextField>
    </div>
  )
}

export default EditIngredientSub