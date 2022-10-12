import React from "react";
import type { Recipe } from "../store";
import { IconButton, ListItem } from "@mui/material";
import { store, dummyRecipe } from "../store";
import { useState as useStateHookstate } from "@hookstate/core";
import EditIcon from "@mui/icons-material/Edit";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface Props {
  recipe: Recipe;
  setRecipeToDelete: React.Dispatch<React.SetStateAction<Recipe>>;
}

const IndividualRecipe: React.FC<Props> = ({ recipe, setRecipeToDelete }) => {
  const state = useStateHookstate(store);

  const handleCurrentRecipeClick = () => {
    state.editedRecipe.set(dummyRecipe);
    state.currentRecipe.set(recipe);
  };

  const handleEditedRecipeClick = () => {
    state.currentRecipe.set(dummyRecipe);
    state.editedRecipe.set(recipe);
  };

  const handleDeleteRecipeClick = async () => {
    if (state.currentRecipe.get() === recipe) {
      state.currentRecipe.set(dummyRecipe);
    }
    if (state.editedRecipe.get() === recipe) {
      state.editedRecipe.set(dummyRecipe);
    }
    setRecipeToDelete(recipe);
  };

  return (
    <ListItem>
      <IconButton onClick={handleCurrentRecipeClick}>
        <SelectAllIcon></SelectAllIcon>
      </IconButton>
      <IconButton onClick={handleEditedRecipeClick}>
        <EditIcon></EditIcon>
      </IconButton>
      <IconButton onClick={handleDeleteRecipeClick}>
        <RemoveCircleIcon></RemoveCircleIcon>
      </IconButton>
      <h5
        onClick={handleCurrentRecipeClick}
        style={{ display: "inline-block", margin: 10 }}
      >
        {recipe.recipeName}
      </h5>
    </ListItem>
  );
};

export default IndividualRecipe;
