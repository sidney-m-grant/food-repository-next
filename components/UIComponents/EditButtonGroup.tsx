import React from "react";
import { ButtonGroup, Button } from "@mui/material";

interface Props {
  addNewRecipeStepBlock: () => void;
  deleteLastRecipeStepBlock: () => void;
  addNewIngredientBlock: () => void;
  deleteLastIngredientBlock: () => void;
}

const EditButtonGroup: React.FC<Props> = ({
  addNewRecipeStepBlock,
  addNewIngredientBlock,
  deleteLastIngredientBlock,
  deleteLastRecipeStepBlock,
}) => {
  return (
    <ButtonGroup>
      <Button style={{ fontSize: 12 }} onClick={addNewRecipeStepBlock}>
        Add New Recipe Step Block
      </Button>
      <Button onClick={deleteLastRecipeStepBlock}>
        Delete Last Recipe Step Block
      </Button>
      <Button onClick={addNewIngredientBlock}>Add New Ingredient Block</Button>
      <Button onClick={deleteLastIngredientBlock}>
        Delete Last Ingredient Block
      </Button>
    </ButtonGroup>
  );
};

export default EditButtonGroup;
