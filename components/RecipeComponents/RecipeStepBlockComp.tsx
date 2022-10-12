import React from "react";
import type { RecipeStepBlock, RecipeStep } from "../store";
import { Card } from "@mui/material";

interface Props {
  stepBlock: RecipeStepBlock;
  recipeStepList: RecipeStepBlock[];
}

const RecipeStepBlockComp: React.FC<Props> = ({ stepBlock }) => {
  const listRecipeSteps = stepBlock.steps.map((item: RecipeStep) => {
    return (
      <h5 key={item.recipeStepNumber}>
        {item.recipeStepNumber}. {item.recipeStepText}
      </h5>
    );
  });

  return (
    <div>
      {stepBlock.for ? (
        <Card sx={{ margin: 0.5, padding: 0.5, display: "inline-block" }}>
          <b>{`${stepBlock.for}`}</b>
        </Card>
      ) : null}
      <Card sx={{ margin: 2, padding: 2 }}>{listRecipeSteps}</Card>
    </div>
  );
};

export default RecipeStepBlockComp;
