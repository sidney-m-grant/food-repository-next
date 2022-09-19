import React from 'react'
import type { Recipe } from '../pages/recipeList'

interface Props{
    recipe: Recipe;
    setCurrentRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    setEditedRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    dummyRecipe: Recipe;
}

const IndividualRecipe: React.FC<Props> = ({ recipe, setCurrentRecipe, setEditedRecipe, dummyRecipe }) => {

  const handleCurrentRecipeClick = () => {
    setEditedRecipe(dummyRecipe);
    setCurrentRecipe(recipe);
  }

  const handleEditedRecipeClick = () => {
    setCurrentRecipe(dummyRecipe);
    setEditedRecipe(recipe);
  }

  return (
    <div className="individual-recipe">
        <h5 style={{ display: 'inline-block', margin: 10 }}>{recipe.recipeName}</h5>
        <button onClick={handleCurrentRecipeClick}>Set as Current Recipe</button>
        <button onClick={handleEditedRecipeClick}>Edit Recipe</button>
    </div>
  )
}

export default IndividualRecipe