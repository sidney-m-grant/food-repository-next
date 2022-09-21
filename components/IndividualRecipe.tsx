import React from 'react'
import type { Recipe } from '../pages/recipeList'
import CurrentRecipe from './CurrentRecipe';
import RecipeButtonBox from './RecipeButtonBox';

interface Props{
    recipe: Recipe;
    setCurrentRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    setEditedRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    dummyRecipe: Recipe; 
    setRecipeToDelete: React.Dispatch<React.SetStateAction<Recipe>>;
    currentRecipe: Recipe;
    editedRecipe: Recipe;
}

const IndividualRecipe: React.FC<Props> = ({ recipe, setCurrentRecipe, setEditedRecipe, dummyRecipe, setRecipeToDelete, currentRecipe, editedRecipe }) => {

  const handleCurrentRecipeClick = () => {
    setEditedRecipe(dummyRecipe);
    setCurrentRecipe(recipe);
  }

  const handleEditedRecipeClick = () => {
    setCurrentRecipe(dummyRecipe);
    setEditedRecipe(recipe);
  }

  const handleDeleteRecipeClick = async () => {
    if (currentRecipe === recipe) {
      setCurrentRecipe(dummyRecipe)
    }
    if (editedRecipe === recipe) {
      setEditedRecipe(dummyRecipe)
    }
    setRecipeToDelete(recipe)
}

  return (
    <div className="individual-recipe">
        <RecipeButtonBox handleCurrentRecipeClick={handleCurrentRecipeClick} handleEditedRecipeClick={handleEditedRecipeClick} handleDeleteRecipeClick={handleDeleteRecipeClick} recipe={recipe} />
       {/*} <button onClick={handleCurrentRecipeClick}>Set as Current Recipe</button>
        <button onClick={handleEditedRecipeClick}>Edit Recipe</button>
  <button onClick={handleDeleteRecipeClick}>Delete Recipe</button> */}
        <h5 style={{ display: 'inline-block', margin: 10 }}>{recipe.recipeName}</h5>
    </div>
  )
}

export default IndividualRecipe