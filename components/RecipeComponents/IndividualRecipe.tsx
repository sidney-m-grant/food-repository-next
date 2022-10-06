import React from "react";
import type { Recipe } from "../../pages/recipeList";
import CurrentRecipe from "./CurrentRecipe";
import RecipeButtonBox from "../UIComponents/RecipeButtonBox";
import { ListItem } from "@mui/material";
import { store } from "../store";
import { useState as useStateHookstate } from "@hookstate/core";

interface Props {
  recipe: Recipe;
  setCurrentRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  setEditedRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  dummyRecipe: Recipe;
  setRecipeToDelete: React.Dispatch<React.SetStateAction<Recipe>>;
  currentRecipe: Recipe;
  editedRecipe: Recipe;
  toggleRecipeBox: string | null | undefined;
  setToggleRecipeBox: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}

const IndividualRecipe: React.FC<Props> = ({
  recipe,
  setCurrentRecipe,
  setEditedRecipe,
  dummyRecipe,
  setRecipeToDelete,
  currentRecipe,
  editedRecipe,
  toggleRecipeBox,
  setToggleRecipeBox,
}) => {
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
    if (currentRecipe === recipe) {
      setCurrentRecipe(dummyRecipe);
    }
    if (editedRecipe === recipe) {
      setEditedRecipe(dummyRecipe);
    }
    setRecipeToDelete(recipe);
  };

  return (
    <ListItem>
      <RecipeButtonBox
        handleCurrentRecipeClick={handleCurrentRecipeClick}
        handleEditedRecipeClick={handleEditedRecipeClick}
        handleDeleteRecipeClick={handleDeleteRecipeClick}
        recipe={recipe}
        toggleRecipeBox={toggleRecipeBox}
        setToggleRecipeBox={setToggleRecipeBox}
      />
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
