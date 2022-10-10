import { Card, IconButton, TextField, Tooltip, Button } from "@mui/material";
import React from "react";
import type { RecipeStepBlock, Recipe } from "../../pages/recipeList";
import EditRecipeSub from "./EditRecipeSub";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { store } from "../store";
import { useState as useStateHookstate, none } from "@hookstate/core";

interface Props {
  recipeStepBlock: RecipeStepBlock;
}

const EditRecipeSubBlock: React.FC<Props> = ({ recipeStepBlock }) => {
  const state = useStateHookstate(store);

  const listRecipeSteps = recipeStepBlock.steps.map((recipeStep) => {
    return (
      <EditRecipeSub
        recipeStep={recipeStep}
        recipeStepBlock={recipeStepBlock}
        key={recipeStep.recipeStepNumber}
      />
    );
  });

  const handleDeleteLastRecipeStep = () => {
    const length =
      state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].steps
        .length;
    state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      length - 1
    ].set(none);
  };

  const handleAddTempRecipeStep = () => {
    const length =
      state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].steps
        .length;
    state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      length
    ].set({
      recipeStepNumber: length + 1,
      recipeStepText: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].for.set(
      e.target.value
    );
  };

  return (
    <Card sx={{ margin: 1, padding: 1 }}>
      <TextField
        size="small"
        helperText="Recipe steps for..."
        onChange={handleChange}
        value={state.editedRecipe.recipeStepList[
          recipeStepBlock.blockNumber
        ].for.get()}
        placeholder={recipeStepBlock.for}
      />
      <Tooltip title="Add Step">
        <IconButton onClick={handleAddTempRecipeStep}>
          <AddCircleIcon></AddCircleIcon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Last Step">
        <IconButton onClick={handleDeleteLastRecipeStep}>
          <RemoveCircleIcon></RemoveCircleIcon>
        </IconButton>
      </Tooltip>
      {listRecipeSteps}
    </Card>
  );
};

export default EditRecipeSubBlock;
