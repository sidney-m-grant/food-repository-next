import { Card, TextField, Tooltip, IconButton, Button } from "@mui/material";
import React, { useState } from "react";
import RecipeInputIngredientSub from "./RecipeInputIngredientSub";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useState as useStateHookstate, none } from "@hookstate/core";
import { store, IngredientBlock } from "../store";

interface Props {
  ingredientBlock: IngredientBlock;
}

const RecipeInputIngredientSubBlock: React.FC<Props> = ({
  ingredientBlock,
}) => {
  useState<IngredientBlock>(ingredientBlock);

  const state = useStateHookstate(store);

  const listIngredients = ingredientBlock.ingredients.map((ingredient) => {
    return (
      <RecipeInputIngredientSub
        ingredient={ingredient}
        ingredientBlock={ingredientBlock}
        key={ingredient.ingredientId}
      />
    );
  });

  const handleAddTempIngredient = () => {
    const length =
      state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients
        .length;
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      length
    ].set({
      ingredientAmount: "",
      ingredientName: "",
      ingredientUnit: "",
      ingredientId: length + 1,
    });
  };

  const handleDeleteLastIngredient = () => {
    const length =
      state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients
        .length;
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].ingredients[
      length - 1
    ].set(none);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.ingredientList[ingredientBlock.blockNumber].for.set(
      e.target.value
    );
  };
  return (
    <Card sx={{ margin: 1, padding: 1 }}>
      <TextField
        size="small"
        helperText="Ingredient block for..."
        onChange={handleChange}
        value={state.inputRecipe.ingredientList[
          ingredientBlock.blockNumber
        ].for.get()}
        placeholder={ingredientBlock.for}
      />
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
      {listIngredients}
    </Card>
  );
};

export default RecipeInputIngredientSubBlock;
