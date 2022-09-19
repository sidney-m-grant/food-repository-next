import React, { useState, useEffect } from 'react'
import { Ingredient, Recipe } from '../pages/recipeList';

interface Props {
    setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    ingredient: Ingredient;
    recipe: Recipe;
}

const EditIngredientSub: React.FC<Props> = ({ setTempRecipe, ingredient, recipe }) => {
    const [editedName, setEditedName] = useState<string>(ingredient.ingredientName)
    const [editedAmount, setEditedAmount] = useState<string>(ingredient.ingredientAmount)
    const [editedUnit, setEditedUnit] = useState<string>(ingredient.ingredientUnit)

    const handleClick = () => {
        let tempArray = recipe.ingredientList;
        tempArray[ingredient.ingredientId-1].ingredientName = editedName;
        tempArray[ingredient.ingredientId-1].ingredientAmount = editedAmount;
        tempArray[ingredient.ingredientId-1].ingredientUnit = editedUnit;
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList: tempArray
            }
        })
    }

    useEffect(() => {
        setEditedName(ingredient.ingredientName)
        setEditedAmount(ingredient.ingredientAmount)
        setEditedUnit(ingredient.ingredientUnit)
    }, [recipe])

  return (
    <div>
        <button onClick={handleClick}>Save Edited Ingredient</button>
        <input onChange={(e) => {setEditedName(e.target.value)}} value={editedName} placeholder={ingredient.ingredientName}></input>
        <input onChange={(e) => {setEditedAmount(e.target.value)}} value={editedAmount} placeholder={ingredient.ingredientAmount}></input>
        <input onChange={(e) => {setEditedUnit(e.target.value)}} value={editedUnit} placeholder={ingredient.ingredientUnit}></input>
    </div>
  )
}

export default EditIngredientSub