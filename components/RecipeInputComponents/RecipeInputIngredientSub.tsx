import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Ingredient, IngredientBlock } from "../../pages/recipeList";
import { useState as useStateHookstate } from "@hookstate/core";
import { store } from "../store";

interface Props {
  setTempIngredientBlock: React.Dispatch<React.SetStateAction<IngredientBlock>>;
  ingredient: Ingredient;
  ingredientBlock: IngredientBlock;
}

const RecipeInputIngredientSub: React.FC<Props> = ({
  setTempIngredientBlock,
  ingredient,
  ingredientBlock,
}) => {
  const state = useStateHookstate(store);
  /*
    const [editedName, setEditedName] = useState<string>(ingredient.ingredientName)
    const [editedAmount, setEditedAmount] = useState<string>(ingredient.ingredientAmount)
    const [editedUnit, setEditedUnit] = useState<string>(ingredient.ingredientUnit)

    useEffect(() => {
        let tempArray = ingredientBlock.ingredients
        tempArray[ingredient.ingredientId-1].ingredientName = editedName;
        tempArray[ingredient.ingredientId-1].ingredientUnit = editedUnit;
        tempArray[ingredient.ingredientId-1].ingredientAmount = editedAmount;
        setTempIngredientBlock(prev => {
            return {
                ...prev,
                ingredientList: tempArray
            }
        })
    }, [editedName, editedAmount, editedUnit])

    useEffect(() => {
        setEditedName(ingredient.ingredientName)
        setEditedUnit(ingredient.ingredientUnit)
        setEditedAmount(ingredient.ingredientAmount)
    }, [ingredientBlock])
*/

  const handleChangeAmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientAmount.set(e.target.value);
  };

  const handleChangeName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientName.set(e.target.value);
  };

  const handleChangeUnit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientUnit.set(e.target.value);
  };

  return (
    <div>
      <TextField
        helperText="amount"
        onChange={handleChangeAmount}
        value={state.inputRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientAmount.get()}
        placeholder={ingredient.ingredientAmount}
      ></TextField>
      <TextField
        helperText="unit"
        onChange={handleChangeUnit}
        value={state.inputRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientUnit.get()}
        placeholder={ingredient.ingredientUnit}
      ></TextField>
      <TextField
        helperText="name"
        onChange={handleChangeName}
        value={state.inputRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientName.get()}
        placeholder={ingredient.ingredientName}
      ></TextField>
    </div>
  );
};

export default RecipeInputIngredientSub;
