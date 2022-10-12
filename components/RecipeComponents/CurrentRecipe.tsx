import React from "react";
import type { Recipe, RecipeStepBlock, IngredientBlock } from "../store";
import RecipeStepBlockComp from "./RecipeStepBlockComp";
import IngredientBlockComp from "./IngredientBlockComp";
import { Card, Grid, Typography, CardMedia } from "@mui/material";

interface Props {
  currentRecipe: Recipe;
}

const CurrentRecipe: React.FC<Props> = ({ currentRecipe }) => {
  const listRecipeSteps = currentRecipe.recipeStepList.map(
    (stepBlock: RecipeStepBlock) => {
      return (
        <RecipeStepBlockComp
          key={stepBlock.blockNumber}
          stepBlock={stepBlock}
          recipeStepList={currentRecipe.recipeStepList}
        />
      );
    }
  );

  const listIngredients = currentRecipe.ingredientList.map(
    (ingBlock: IngredientBlock) => {
      return (
        <IngredientBlockComp
          key={ingBlock.blockNumber}
          ingBlock={ingBlock}
          ingredientList={currentRecipe.ingredientList}
        />
      );
    }
  );

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Card
            sx={{
              margin: 3,
              padding: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 20 }}>
              <b>{currentRecipe.recipeName}</b>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card
            sx={{
              margin: 3,
              padding: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentRecipe.imgPath ? (
              <CardMedia
                component="img"
                image={currentRecipe.imgPath}
                sx={{ height: 180, width: 180 }}
              />
            ) : null}
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card
            sx={{
              margin: 3,
              padding: 3,
            }}
          >
            <Typography sx={{ margin: 1, padding: 1 }}>
              <b>Source: </b>
              {currentRecipe.source}
            </Typography>
            <Typography sx={{ margin: 1, padding: 1 }}>
              <b>Prep Time: </b>
              {currentRecipe.prepTime}
            </Typography>
            <Typography sx={{ margin: 1, padding: 1 }}>
              <b>Active Cooking Time: </b>
              {currentRecipe.activeCookingTime}
            </Typography>
            <Typography sx={{ margin: 1, padding: 1 }}>
              <b>Total Cooking Time: </b>
              {currentRecipe.totalTime}
            </Typography>
            <Typography sx={{ margin: 1, padding: 1 }}>
              <b>Serves: </b>
              {currentRecipe.servesAmount}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Card
        sx={{
          margin: 3,
          padding: 3,
          display: "flex",
          justifyContent: "left",
        }}
      >
        <Typography sx={{ margin: 2, padding: 2 }}>
          <b>Brief Description: {currentRecipe.briefDescription}</b>
        </Typography>
      </Card>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <Card sx={{ margin: 3, padding: 3 }}>{listIngredients}</Card>
        </Grid>
        <Grid item xs={8}>
          <Card sx={{ margin: 3, padding: 3 }}>{listRecipeSteps}</Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CurrentRecipe;
