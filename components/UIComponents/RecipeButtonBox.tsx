import React, { useState } from 'react'
import type { Recipe } from '../../pages/recipeList'
import { Button, ButtonGroup } from '@mui/material'

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
    <>
        {toggleRecipeBox != recipe.docId ? <Button onClick={handleToggleClick}>Show More</Button> : ( 
            <ButtonGroup orientation="vertical">
                <Button onClick={handleShowLess}>Show Less</Button>
                <Button onClick={handleCurrentRecipeClick}>Set as Current Recipe</Button>
                <Button onClick={handleEditedRecipeClick}>Edit Recipe</Button>
                <Button onClick={handleDelete}>Delete Recipe</Button>
            </ButtonGroup>
        )}
    </>    
  )
}

export default RecipeButtonBox