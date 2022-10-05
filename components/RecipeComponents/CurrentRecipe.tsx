import React from 'react'
import type { Recipe, RecipeStep, Ingredient, RecipeStepBlock, IngredientBlock } from '../../pages/recipeList'
import RecipeStepBlockComp from './RecipeStepBlockComp'
import IngredientBlockComp from './IngredientBlockComp'
import { ButtonGroup, Card, Grid, Button, TextField, Typography, CardMedia} from '@mui/material'

interface Props {
  currentRecipe: Recipe
}

const CurrentRecipe: React.FC<Props> = ({ currentRecipe }) => {

    const listRecipeSteps = currentRecipe.recipeStepList.map((stepBlock: RecipeStepBlock) => {
      return <RecipeStepBlockComp key={currentRecipe.recipeStepList.indexOf(stepBlock)} stepBlock={stepBlock} recipeStepList={currentRecipe.recipeStepList} />
    })
    
    const listIngredients = currentRecipe.ingredientList.map((ingBlock: IngredientBlock) => {
      return <IngredientBlockComp key={currentRecipe.ingredientList.indexOf(ingBlock)} ingBlock={ingBlock} ingredientList={currentRecipe.ingredientList} />
    })

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item>
          <Card sx={{ margin: 3, padding: 3, width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 20}}>
              {currentRecipe.recipeName}
            </Typography> 
          </Card>
        </Grid>
        <Grid item>
            <Card sx={{ margin: 3, padding: 3, width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              { currentRecipe.imgPath ? <CardMedia component="img" image={currentRecipe.imgPath} sx={{ height: 180, width: 180 }} /> : null }
          </Card>
        </Grid>
      </Grid>
      
      
        <Grid container spacing={0}>
            <Grid item xs={4}>
              <Card sx={{ margin: 3, padding: 3}}>
                 {listIngredients}
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card sx={{ margin: 3, padding: 3}}>
                 {listRecipeSteps}
              </Card>
            </Grid>    
        </Grid>
    </Card>
  )
}

export default CurrentRecipe