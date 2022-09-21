import React, { useState } from 'react'
import type { Recipe } from '../pages/recipeList'

interface Props {
    handleCurrentRecipeClick: () => void;
    handleEditedRecipeClick: () => void;
    handleDeleteRecipeClick: () => void;
    recipe: Recipe;
    toggleRecipeBox: string | null | undefined;
    setToggleRecipeBox: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const RecipeButtonBox: React.FC<Props> = ({ handleCurrentRecipeClick, handleDeleteRecipeClick, handleEditedRecipeClick, toggleRecipeBox, setToggleRecipeBox, recipe }) => {

    const handleToggleClick = () => {
        setToggleRecipeBox(recipe?.docId)
    }

    const handleShowLess = () => {
        setToggleRecipeBox(null)
    }

    const handleDelete = () => {
        handleDeleteRecipeClick()
        handleToggleClick()
    }

  return (
    <div style={{ display: 'inline-block', margin: 10 }}>
        {toggleRecipeBox != recipe.docId ? <button onClick={handleToggleClick}>Show More</button> : ( 
            <div>
                <button onClick={handleShowLess}>Show Less</button>
                <button onClick={handleCurrentRecipeClick}>Set as Current Recipe</button>
                <button onClick={handleEditedRecipeClick}>Edit Recipe</button>
                <button onClick={handleDelete}>Delete Recipe</button>
            </div>
        )}
    </div>    
  )
}

export default RecipeButtonBox