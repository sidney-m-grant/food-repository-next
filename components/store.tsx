import { createState } from "@hookstate/core";
import type { Recipe } from "../pages/recipeList";

const dummyRecipe: Recipe = {
  recipeName: "",
  recipeStepList: [
    {
      for: "",
      steps: [
        {
          recipeStepNumber: 1,
          recipeStepText: "",
        },
      ],
      blockNumber: 0,
    },
  ],
  ingredientList: [
    {
      for: "",
      ingredients: [
        {
          ingredientAmount: "",
          ingredientId: 1,
          ingredientName: "",
          ingredientUnit: "",
        },
      ],
      blockNumber: 0,
    },
  ],
};

export const store = createState({
  currentRecipe: dummyRecipe,
  editedRecipe: dummyRecipe,
  inputRecipe: dummyRecipe,
});
