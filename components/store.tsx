import { createState } from "@hookstate/core";
import { dummyRecipe } from "../pages/recipeList";

export const store = createState({
  currentRecipe: dummyRecipe,
  editedRecipe: dummyRecipe,
});
