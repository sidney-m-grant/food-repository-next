import React, { useState } from "react";
import SignOutButton from "../components/UIComponents/SignOutButton";
import Link from "next/link";
import RecipeInputComp from "../components/RecipeInputComponents/RecipeInputComp";
import { Card, Button } from "@mui/material";
import { store } from "../components/store";
import { useState as useStateHookstate } from "@hookstate/core";
import SplitArrayInput from "../components/UIComponents/SplitArrayInput";

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
    // takes input in the recipe input, trims any whitespace at the ends, and then splits for every new line
    const tempArray = splitRecipeArrayInput.trim().split(/\n/);
    // initialize variables
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
    // loop through the input, now seperated by page return
    for (var i = 0; i < tempArray.length; i++) {
      if (
        // if the first word of the current string is 'for' and it ends in a column...
        tempArray[i].toLowerCase().match(forStatementRegex) &&
        tempArray[i].match(/\:$/)
      ) {
        // if this is the first 'for', set the statement to the 'for' property of the first block
        if (firstBlock === true) {
          tempRecipeStepSplitList[0] = {
            for: tempArray[i],
            steps: [
              {
                recipeStepNumber: 1,
                recipeStepText: "",
              },
            ],
            blockNumber: 0,
          };
          firstBlock = false;
        } else {
          // otherwise, set the statement as the 'for property of the second block, and all further statements
          // untill the next for statement will be assigned to that block
          counter++;
          tempRecipeStepSplitList[counter] = {
            for: tempArray[i],
            steps: [
              {
                recipeStepNumber: 1,
                recipeStepText: "",
              },
            ],
            blockNumber: counter,
          };
          firstStep = true;
        }
      } else {
        // if its the first step after a for loop, set the first step
        if (firstStep === true) {
          tempRecipeStepSplitList[counter].steps[0] = {
            recipeStepNumber: 1,
            recipeStepText: tempArray[i],
          };
          firstStep = false;
        } else {
          // otherwise, continue to add to the current block
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
            ingredients: [
              {
                ingredientAmount: "",
                ingredientId: 1,
                ingredientName: "",
                ingredientUnit: "",
              },
            ],
            blockNumber: 0,
          };
          firstBlock = false;
        } else {
          counter++;
          tempIngredientSplitList[counter] = {
            for: tempArray[i],
            ingredients: [
              {
                ingredientAmount: "",
                ingredientId: 1,
                ingredientName: "",
                ingredientUnit: "",
              },
            ],
            blockNumber: counter,
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
      <SplitArrayInput
        splitIngredientArrayInput={splitIngredientArrayInput}
        splitRecipeArrayInput={splitRecipeArrayInput}
        setSplitIngredientArrayInput={setSplitIngredientArrayInput}
        setSplitRecipeArrayInput={setSplitRecipeArrayInput}
      />
    </>
  );
};

export default RecipeInput;
