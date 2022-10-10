import { TextField } from "@mui/material";
import React from "react";
import { Ingredient, IngredientBlock } from "../../pages/recipeList";
import { useState as useStateHookstate } from "@hookstate/core";
import { store } from "../store";

interface Props {
  ingredient: Ingredient;
  ingredientBlock: IngredientBlock;
}

const EditIngredientSub: React.FC<Props> = ({
  ingredient,
  ingredientBlock,
}) => {
  const state = useStateHookstate(store);

  const handleChangeAmount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientAmount.set(e.target.value);
  };

  const handleChangeName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientName.set(e.target.value);
  };

  const handleChangeUnit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      ingredient.ingredientId - 1
    ].ingredientUnit.set(e.target.value);
  };

  return (
    <div>
      <TextField
        helperText="amount"
        onChange={handleChangeAmount}
        value={state.editedRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientAmount.get()}
        placeholder={ingredient.ingredientAmount}
      ></TextField>
      <TextField
        helperText="unit"
        onChange={handleChangeUnit}
        value={state.editedRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientUnit.get()}
        placeholder={ingredient.ingredientUnit}
      ></TextField>
      <TextField
        helperText="name"
        onChange={handleChangeName}
        value={state.editedRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].ingredients[ingredient.ingredientId - 1].ingredientName.get()}
        placeholder={ingredient.ingredientName}
      ></TextField>
    </div>
  );
};

export default EditIngredientSub;
