import { Card, Typography } from "@mui/material";
import React from "react";
import type {
  Ingredient,
  IngredientBlock,
  Recipe,
} from "../../pages/recipeList";

interface Props {
  ingBlock: IngredientBlock;
  ingredientList: IngredientBlock[];
}

const IngredientBlockComp: React.FC<Props> = ({ ingBlock, ingredientList }) => {
  const listIngredients = ingBlock.ingredients.map((ingredient: Ingredient) => {
    return (
      <h5 key={ingredient.ingredientId}>
        * {ingredient.ingredientAmount} {ingredient.ingredientUnit}{" "}
        {ingredient.ingredientName}
      </h5>
    );
  });

  return (
    <div>
      {ingBlock.for ? (
        <Card sx={{ margin: 0.5, padding: 0.5, display: "inline-block" }}>
          <b>{`${ingBlock.for}`}</b>
        </Card>
      ) : null}
      <Card sx={{ margin: 2, padding: 2 }}>{listIngredients}</Card>
    </div>
  );
};

export default IngredientBlockComp;
