import React from "react";
import type { Recipe } from "../../pages/recipeList";
import RecipeButtonBox from "../UIComponents/RecipeButtonBox";
import { ListItem } from "@mui/material";
import { store, dummyRecipe } from "../store";
import { useState as useStateHookstate } from "@hookstate/core";

interface Props {
  recipe: Recipe;
  setRecipeToDelete: React.Dispatch<React.SetStateAction<Recipe>>;
  toggleRecipeBox: string | null | undefined;
  setToggleRecipeBox: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}

const IndividualRecipe: React.FC<Props> = ({
  recipe,
  setRecipeToDelete,
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
