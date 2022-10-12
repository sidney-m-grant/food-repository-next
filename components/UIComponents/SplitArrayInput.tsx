import React from "react";
import { Card, Grid, TextField } from "@mui/material";

interface Props {
  splitIngredientArrayInput: string;
  splitRecipeArrayInput: string;
  setSplitIngredientArrayInput: React.Dispatch<React.SetStateAction<string>>;
  setSplitRecipeArrayInput: React.Dispatch<React.SetStateAction<string>>;
}

const SplitArrayInput: React.FC<Props> = ({
  splitIngredientArrayInput,
  splitRecipeArrayInput,
  setSplitIngredientArrayInput,
  setSplitRecipeArrayInput,
}) => {
  return (
    <Card>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <Card
            sx={{
              margin: 1,
              padding: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              multiline
              onChange={(e) => setSplitRecipeArrayInput(e.target.value)}
              value={splitRecipeArrayInput}
              helperText="Recipe"
              sx={{ width: 0.9 }}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              margin: 1,
              padding: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              multiline
              onChange={(e) => setSplitIngredientArrayInput(e.target.value)}
              value={splitIngredientArrayInput}
              helperText="Ingredients"
              sx={{ width: 0.9 }}
            />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SplitArrayInput;
