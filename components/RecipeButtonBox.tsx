import React, { useState } from 'react'
import type { Recipe } from '../pages/recipeList'

interface Props {
    handleCurrentRecipeClick: () => void;
    handleEditedRecipeClick: () => void;
    handleDeleteRecipeClick: () => void;
    recipe: Recipe;
}

const RecipeButtonBox: React.FC<Props> = ({ handleCurrentRecipeClick, handleDeleteRecipeClick, handleEditedRecipeClick }) => {
    const [toggleDisplay, setToggleDisplay] = useState<boolean>(false)

    const handleToggleClick = () => {
        setToggleDisplay(!toggleDisplay)
    }

    const handleDelete = () => {
        handleDeleteRecipeClick()
        handleToggleClick()
    }

  return (
    <div style={{ display: 'inline-block', margin: 10 }}>
        {!toggleDisplay ? <button onClick={handleToggleClick}>Show More</button> : ( 
            <div>
                <button onClick={handleToggleClick}>Show Less</button>
                <button onClick={handleCurrentRecipeClick}>Set as Current Recipe</button>
                <button onClick={handleEditedRecipeClick}>Edit Recipe</button>
                <button onClick={handleDelete}>Delete Recipe</button>
            </div>
        )}
    </div>    
  )
}

export default RecipeButtonBox