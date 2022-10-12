import { createState } from "@hookstate/core";

export type RecipeStepBlock = {
  for: string;
  steps: RecipeStep[];
  blockNumber: number;
};

export type IngredientBlock = {
  for: string;
  ingredients: Ingredient[];
  blockNumber: number;
};

export type Ingredient = {
  ingredientName: string;
  ingredientAmount: string;
  ingredientUnit: string;
  ingredientId: number;
};

export type Recipe = {
  recipeName: string;
  docId?: string;
  recipeStepList: RecipeStepBlock[];
  ingredientList: IngredientBlock[];
  imgPath?: string;
  prepTime?: string;
  activeCookingTime?: string;
  totalTime?: string;
  servesAmount?: string;
  source?: string;
  briefDescription?: string;
  collections: Collection[];
  tags: Tag[];
};

export type Collection = {
  collectionId: number;
  collectionName: string;
};

export type Tag = {
  tagId: number;
  tagName: string;
};

export type RecipeStep = {
  recipeStepText: string;
  recipeStepNumber: number;
};

export const dummyRecipe: Recipe = {
  recipeName: "",
  prepTime: "",
  activeCookingTime: "",
  totalTime: "",
  servesAmount: "",
  source: "",
  briefDescription: "",
  collections: [{ collectionName: "", collectionId: 0 }],
  tags: [{ tagId: 0, tagName: "" }],
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
