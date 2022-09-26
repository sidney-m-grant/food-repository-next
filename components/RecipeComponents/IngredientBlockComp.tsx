import { Typography } from '@mui/material';
import React from 'react'
import type { Ingredient, IngredientBlock, Recipe } from '../../pages/recipeList'

interface Props {
    ingBlock: IngredientBlock;
    ingredientList: IngredientBlock[]
}

const IngredientBlockComp: React.FC<Props> = ({ ingBlock, ingredientList }) => {

    const listIngredients = ingBlock.ingredients.map((ingredient: Ingredient) => {
        return <Typography key={ingredient.ingredientId}>* {ingredient.ingredientAmount}  {ingredient.ingredientUnit}  {ingredient.ingredientName}</Typography>
    }) 
    
  return (
    <div>
        {`${ingBlock.for }`}
        {listIngredients}
    </div>
  )
}

export default IngredientBlockComp