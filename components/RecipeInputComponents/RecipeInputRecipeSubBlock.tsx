import { Card, IconButton, TextField, Tooltip, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { RecipeStepBlock, Recipe } from "../../pages/recipeList";
import RecipeInputRecipeSub from "./RecipeInputRecipeSub";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { store } from "../store";
import { useState as useStateHookstate, none } from "@hookstate/core";

interface Props {
  // setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  recipeStepBlock: RecipeStepBlock;
  // tempRecipe: Recipe;
}

const RecipeInputRecipeSubBlock: React.FC<Props> = ({
  // setTempRecipe,
  recipeStepBlock,
  // tempRecipe,
}) => {
  const [forStatement, setForStatement] = useState<string>(recipeStepBlock.for);
  const [tempRecipeStepBlock, setTempRecipeStepBlock] =
    useState<RecipeStepBlock>(recipeStepBlock);

  const state = useStateHookstate(store);

  const listRecipeSteps = recipeStepBlock.steps.map((recipeStep) => {
    return (
      <RecipeInputRecipeSub
        //     setTempRecipeStepBlock={setTempRecipeStepBlock}
        recipeStep={recipeStep}
        recipeStepBlock={recipeStepBlock}
        key={recipeStep.recipeStepNumber}
      />
    );
  });
  /*
  useEffect(() => {
    let tempRecipeStepList = tempRecipe.recipeStepList;
    tempRecipeStepList[recipeStepBlock.blockNumber] = tempRecipeStepBlock;
    tempRecipeStepList[recipeStepBlock.blockNumber].for = forStatement;
    setTempRecipe((prev: Recipe) => {
      return {
        ...prev,
        recipeStepList: tempRecipeStepList,
      };
    });
  }, [tempRecipeStepBlock]);

  useEffect(() => {
    setTempRecipeStepBlock((prev) => {
      return {
        ...prev,
        for: forStatement,
      };
    });
  }, [forStatement]);

  useEffect(() => {
    setForStatement(recipeStepBlock.for);
  }, [recipeStepBlock]);

  const handleAddTempRecipeStep = () => {
    let tempRecipeAddition = tempRecipeStepBlock;
    tempRecipeAddition.steps.push({
      recipeStepNumber: tempRecipeAddition.steps.length + 1,
      recipeStepText: "",
      recipeStepType: "text",
    });
    setTempRecipeStepBlock((prev) => {
      return {
        ...prev,
        steps: tempRecipeAddition.steps,
      };
    });
  };

  const handleDeleteLastRecipeStep = () => {
    let tempRecipeSubtraction = tempRecipeStepBlock;
    tempRecipeSubtraction.steps.pop();
    setTempRecipeStepBlock((prev) => {
      return {
        ...prev,
        steps: tempRecipeSubtraction.steps,
      };
    });
  };
*/

  const handleDeleteLastRecipeStep = () => {
    const length =
      state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].steps
        .length;
    state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      length - 1
    ].set(none);
  };

  const handleAddTempRecipeStep = () => {
    const length =
      state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].steps
        .length;
    state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      length
    ].set({
      recipeStepNumber: length + 1,
      recipeStepText: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].for.set(
      e.target.value
    );
  };

  return (
    <Card sx={{ margin: 1, padding: 1 }}>
      <TextField
        size="small"
        helperText="Recipe steps for..."
        onChange={handleChange}
        value={state.inputRecipe.recipeStepList[
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

export default RecipeInputRecipeSubBlock;
