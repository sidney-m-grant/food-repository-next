import React, { useState } from "react";
import SignOutButton from "../components/UIComponents/SignOutButton";
import Link from "next/link";
import RecipeInputComp from "../components/RecipeInputComponents/RecipeInputComp";
import { dummyRecipe, Recipe } from "../pages/recipeList";
import { Card, Button, TextField } from "@mui/material";

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
  const [inputRecipe, setInputRecipe] = useState<Recipe>(dummyRecipe);
  const [splitArrayInput, setSplitArrayInput] = useState<string>("");
  const [test, setTest] = useState<Recipe>();

  const handleRecipeStepSplit = () => {
    const tempArray = splitArrayInput.split(/\n/);
    let firstStep = true;
    let firstBlock = true;
    let counter = 0;
    let tempRecipeStepSplitList = dummyRecipe.recipeStepList;
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
    const temp: Recipe = {
      recipeName: "",
      recipeStepList: tempRecipeStepSplitList,
      ingredientList: [
        {
          blockNumber: 0,
          for: "",
          ingredients: [
            {
              ingredientName: "",
              ingredientAmount: "",
              ingredientUnit: "",
              ingredientId: 1,
            },
          ],
        },
      ],
    };
    setTest(temp);
  };

  const handleIngredientSplit = () => {
    const tempArray = splitArrayInput.trim().split(/\n/);
    let tempAmount = "";
    let tempUnit: any = "";
    let tempName = "";
    let firstIngredient = true;
    let firstBlock = true;
    let counter = 0;
    let tempIngredientSplitList = dummyRecipe.ingredientList;
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
    const temp: Recipe = {
      recipeName: "",
      recipeStepList: [
        {
          for: "",
          blockNumber: 0,
          steps: [{ recipeStepNumber: 1, recipeStepText: "" }],
        },
      ],
      ingredientList: tempIngredientSplitList,
    };
    console.log(temp.ingredientList[0]);
    console.log(temp);
    console.log(temp.ingredientList[0]);
    setTest(temp);
  };
  /**
   * [1, 2, 3]
   *
   */
  /*
    const handleTest = () => {
        const testRecipe: Recipe = {
            recipeName: 'test',
            recipeStepList: [{
                for: 'test',
                steps: [{
                    recipeStepNumber: 1,
                    recipeStepText: 'test',
                    recipeStepType: 'text'
                }],
                blockNumber: 0
            }],
            ingredientList: [{
                for: 'test',
                ingredients: [{
                    ingredientAmount: 'test',
                    ingredientId: 1,
                    ingredientName: 'test',
                    ingredientUnit: 'test',
                }],
                blockNumber: 0
            },
            {
                for: 'test',
                ingredients: [{
                    ingredientAmount: 'test',
                    ingredientId: 1,
                    ingredientName: 'test',
                    ingredientUnit: 'test',
                }],
                blockNumber: 2
            },
        ]
        }
        setInputRecipe(testRecipe)
    } */

  return (
    <>
      <RecipeInputComp inputRecipe={inputRecipe} />
      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Link href="/recipeList">
          <Button>To Recipe List</Button>
        </Link>
        <Link href="/social">
          <Button>To Social</Button>
        </Link>
        <SignOutButton />
      </Card>
      <TextField
        multiline
        onChange={(e) => setSplitArrayInput(e.target.value)}
        value={splitArrayInput}
        sx={{ width: 1000, height: 500 }}
      />
      <Button onClick={handleRecipeStepSplit}>Split String</Button>
      <Button onClick={handleIngredientSplit}>Split Ingredients</Button>
      {/*}    <button onClick={handleTest} >test</button> */}
    </>
  );
};

export default RecipeInput;
