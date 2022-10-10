import { TextField } from "@mui/material";
import React, { useState } from "react";
import type { RecipeStep, RecipeStepBlock } from "../../pages/recipeList";
import { store } from "../store";
import { useState as useStateHookstate } from "@hookstate/core";

interface Props {
  recipeStep: RecipeStep;
  recipeStepBlock: RecipeStepBlock;
}

const EditRecipeSub: React.FC<Props> = ({ recipeStep, recipeStepBlock }) => {
  const state = useStateHookstate(store);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      recipeStep.recipeStepNumber - 1
    ].recipeStepText.set(e.target.value);
  };

  return (
    <div>
      {
        <TextField
          sx={{ width: 490 }}
          onChange={handleChange}
          value={state.editedRecipe.recipeStepList[
            recipeStepBlock.blockNumber
          ].steps[recipeStep.recipeStepNumber - 1].recipeStepText.get()}
          multiline
          placeholder={recipeStep.recipeStepText}
        />
      }
    </div>
  );
};

export default EditRecipeSub;
