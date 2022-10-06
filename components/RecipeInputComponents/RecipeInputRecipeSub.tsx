import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import type {
  Recipe,
  RecipeStep,
  RecipeStepBlock,
} from "../../pages/recipeList";
import { store } from "../store";
import { useState as useStateHookstate } from "@hookstate/core";

interface Props {
  //  setTempRecipeStepBlock: React.Dispatch<React.SetStateAction<RecipeStepBlock>>;
  recipeStep: RecipeStep;
  recipeStepBlock: RecipeStepBlock;
}

const RecipeInputRecipeSub: React.FC<Props> = ({
  // setTempRecipeStepBlock,
  recipeStep,
  recipeStepBlock,
}) => {
  const [editedText, setEditedText] = useState<string>(
    recipeStep.recipeStepText
  );
  // const [tempImg, setTempImg] = useState <File | null>(null)

  const state = useStateHookstate(store);
  /*
  useEffect(() => {
    let tempArray = recipeStepBlock.steps;
    tempArray[recipeStep.recipeStepNumber - 1].recipeStepText = editedText;
    setTempRecipeStepBlock((prev) => {
      return {
        ...prev,
        steps: tempArray,
      };
    });
  }, [editedText]);

  useEffect(() => {
    setEditedText(recipeStep.recipeStepText);
  }, [recipeStepBlock]);
*/
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.recipeStepList[recipeStepBlock.blockNumber].steps[
      recipeStep.recipeStepNumber - 1
    ].recipeStepText.set(e.target.value);
  };

  return (
    <div>
      {
        //  recipeStep.recipeStepType === "file" ?
        //  <input type="file" onChange={(e: any) => setTempImg(e.target.files[0])}></input> :
        <TextField
          sx={{ width: 490 }}
          onChange={handleChange}
          value={state.inputRecipe.recipeStepList[
            recipeStepBlock.blockNumber
          ].steps[recipeStep.recipeStepNumber - 1].recipeStepText.get()}
          multiline
          placeholder={recipeStep.recipeStepText}
        />
      }
    </div>
  );
};

export default RecipeInputRecipeSub;
