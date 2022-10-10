import React, { useState } from "react";
import SignOutButton from "../components/UIComponents/SignOutButton";
import Link from "next/link";
import RecipeInputComp from "../components/RecipeInputComponents/RecipeInputComp";
import { Card, Button, TextField, Grid } from "@mui/material";
import { store } from "../components/store";
import { useState as useStateHookstate } from "@hookstate/core";

const forStatementRegex = /^for\b/;
const unitList = [
  "teaspoons",
  "tablespoons",
  "tbsp",
  "tablespoon",
  "cup",
  "gram",
  "kilogram",
  "teaspoon",
  "tsp",
  "liter",
  "lb",
  "pound",
  "container",
  "gallon",
  "quart",
  "pint",
  "fl oz",
  "oz",
  "ounces",
  "handful",
  "dash",
  "milliters",
];
const unitRegex = new RegExp("\\b(" + unitList.join("|") + ")\\b", "g");

const RecipeInput = () => {
  const [splitIngredientArrayInput, setSplitIngredientArrayInput] =
    useState<string>("");
  const [splitRecipeArrayInput, setSplitRecipeArrayInput] =
    useState<string>("");

  const state = useStateHookstate(store);

  const handleRecipeStepSplit = () => {
    const tempArray = splitRecipeArrayInput.trim().split(/\n/);
    let firstStep = true;
    let firstBlock = true;
    let counter = 0;
    let tempRecipeStepSplitList = [
      {
        for: "",
        steps: [
          {
            recipeStepNumber: 1,
            recipeStepText: "",
          },
        ],
        blockNumber: 0,
      },
    ];
    for (var i = 0; i < tempArray.length; i++) {
      if (
        tempArray[i].toLowerCase().match(forStatementRegex) &&
        tempArray[i].match(/\:$/)
      ) {
        if (firstBlock === true) {
          tempRecipeStepSplitList[0] = {
            for: tempArray[i],
            blockNumber: 0,
            steps: [
              {
                recipeStepNumber: 1,
                recipeStepText: "",
              },
            ],
          };
          firstBlock = false;
        } else {
          counter++;
          tempRecipeStepSplitList[counter] = {
            for: tempArray[i],
            blockNumber: counter,
            steps: [
              {
                recipeStepNumber: 1,
                recipeStepText: "",
              },
            ],
          };
          firstStep = true;
        }
      } else {
        if (firstStep === true) {
          tempRecipeStepSplitList[counter].steps[0] = {
            recipeStepNumber: 1,
            recipeStepText: tempArray[i],
          };
          firstStep = false;
        } else {
          tempRecipeStepSplitList[counter].steps[
            tempRecipeStepSplitList[counter].steps.length
          ] = {
            recipeStepNumber: tempRecipeStepSplitList[counter].steps.length + 1,
            recipeStepText: tempArray[i],
          };
        }
      }
    }
    state.inputRecipe.recipeStepList.set(tempRecipeStepSplitList);
  };

  const handleIngredientSplit = () => {
    const tempArray = splitIngredientArrayInput.trim().split(/\n/);
    let tempAmount = "";
    let tempUnit: any = "";
    let tempName = "";
    let firstIngredient = true;
    let firstBlock = true;
    let counter = 0;
    let tempIngredientSplitList = [
      {
        for: "",
        ingredients: [
          {
            ingredientAmount: "",
            ingredientId: 1,
            ingredientName: "",
            ingredientUnit: "",
          },
        ],
        blockNumber: 0,
      },
    ];
    for (var i = 0; i < tempArray.length; i++) {
      if (
        tempArray[i].toLowerCase().match(forStatementRegex) &&
        tempArray[i].match(/\:$/)
      ) {
        if (firstBlock === true) {
          tempIngredientSplitList[0] = {
            for: tempArray[i],
            blockNumber: 0,
            ingredients: [
              {
                ingredientAmount: "",
                ingredientName: "",
                ingredientUnit: "",
                ingredientId: 1,
              },
            ],
          };
          firstBlock = false;
        } else {
          counter++;
          tempIngredientSplitList[counter] = {
            for: tempArray[i],
            blockNumber: counter,
            ingredients: [
              {
                ingredientAmount: "",
                ingredientName: "",
                ingredientUnit: "",
                ingredientId: 1,
              },
            ],
          };
          firstIngredient = true;
          console.log(counter);
        }
      } else {
        if (firstIngredient === true) {
          var match: any = tempArray[i].match(/[A-Za-z]/);
          var index = tempArray[i].indexOf(match[0]);
          tempAmount = tempArray[i].substring(0, index).trim();
          if (tempArray[i].match(unitRegex)) {
            const temp: any = tempArray[i].match(unitRegex);
            tempUnit = temp[0];
            index = index + tempUnit.length;
          } else {
            tempUnit = "";
          }
          tempName = tempArray[i].substring(index, tempArray[i].length).trim();
          tempIngredientSplitList[counter].ingredients[0] = {
            ingredientAmount: tempAmount,
            ingredientUnit: tempUnit,
            ingredientName: tempName,
            ingredientId: 1,
          };
          firstIngredient = false;
        } else {
          var match: any = tempArray[i].match(/[A-Za-z]/);
          var index = tempArray[i].indexOf(match[0]);
          tempAmount = tempArray[i].substring(0, index).trim();
          if (tempArray[i].match(unitRegex)) {
            const temp: any = tempArray[i].match(unitRegex);
            tempUnit = temp[0];
            index = index + tempUnit.length;
          } else {
            tempUnit = "";
          }
          tempName = tempArray[i].substring(index, tempArray[i].length).trim();
          tempIngredientSplitList[counter].ingredients[
            tempIngredientSplitList[counter].ingredients.length
          ] = {
            ingredientAmount: tempAmount,
            ingredientUnit: tempUnit,
            ingredientName: tempName,
            ingredientId:
              tempIngredientSplitList[counter].ingredients.length + 1,
          };
        }
      }
    }
    state.inputRecipe.ingredientList.set(tempIngredientSplitList);
  };

  const handleSplit = () => {
    handleIngredientSplit();
    handleRecipeStepSplit();
  };

  return (
    <>
      <RecipeInputComp />
      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Link href="/recipeList">
          <Button>To Recipe List</Button>
        </Link>
        <Link href="/social">
          <Button>To Social</Button>
        </Link>
        <SignOutButton />
      </Card>
      <Card sx={{ padding: 1, margin: 1, width: 250 }}>
        <Button onClick={handleSplit}>Upload Split</Button>
      </Card>
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
    </>
  );
};

export default RecipeInput;
