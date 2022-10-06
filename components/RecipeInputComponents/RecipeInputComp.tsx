import React, { useState, useEffect } from "react";
import type { Recipe, IngredientBlock } from "../../pages/recipeList";
import CurrentRecipe from "../RecipeComponents/CurrentRecipe";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import RecipeInputRecipeSubBlock from "./RecipeInputRecipeSubBlock";
import RecipeInputIngredientSubBlock from "./RecipeInputIngredientSubBlock";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Compressor from "compressorjs";
import { ButtonGroup, Card, Grid, Button, TextField } from "@mui/material";
import { useState as useStateHookstate, none } from "@hookstate/core";
import { store } from "../store";
import { useRouter } from "next/router";

export type IngredientSplit = {
  amount: string;
  name: string;
  unit: string;
};

interface Props {
  inputRecipe: Recipe;
}

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
const forStatementRegex = /^for\b/;

const RecipeInputComp: React.FC<Props> = ({ inputRecipe }) => {
  const router = useRouter();
  const state = useStateHookstate(store);
  const { user } = useAuth();

  const [tempRecipe, setTempRecipe] = useState<Recipe>(inputRecipe);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setTempRecipe(inputRecipe);
  }, [inputRecipe]);

  /*
    const handleRecipeStepSplit = () => {
        const tempArray = splitArrayInput.split(/\n/)
        setSplitArray(tempArray)
        let firstStep = true;
        let firstBlock = true;
        let counter = 0
        let tempRecipeStepSplitList = dummyRecipe.recipeStepList;
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].toLowerCase().match(forStatementRegex) && tempArray[i].match(/\:$/)) {
               if (firstBlock === true) {
                    tempRecipeStepSplitList[0] = {
                        for: tempArray[i],
                        blockNumber: 0,
                        steps: [{ recipeStepType: 'text', recipeStepNumber: 1, recipeStepText: '' }]
                    }
                    firstBlock = false;
                } else {
                    counter++
                    tempRecipeStepSplitList[counter] = {
                        for: tempArray[i],
                        blockNumber: counter,
                        steps: [{ recipeStepType: 'text', recipeStepNumber: 1, recipeStepText: '' }]
                    }
                    firstStep = true;
                }
            } else {
                if (firstStep === true) {
                    tempRecipeStepSplitList[counter].steps[0] = ({ recipeStepNumber: 1, recipeStepText: tempArray[i], recipeStepType: "text" })
                    firstStep = false
                } else {
                    tempRecipeStepSplitList[counter].steps[tempRecipeStepSplitList[counter].steps.length] = { recipeStepNumber: tempRecipeStepSplitList[counter].steps.length+1, recipeStepType: 'text', recipeStepText: tempArray[i]}
                }
            }
        }
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempRecipeStepSplitList
            }
        })
    }

    const handleIngredientSplit = () => {
        const tempArray = splitArrayInput.split(/\n/)
        let tempAmount = ''
        let tempUnit: any = ''
        let tempName = ''
        let firstIngredient = true
        let firstBlock = true
        let counter = 0
        let tempIngredientSplitList = dummyRecipe.ingredientList
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].toLowerCase().match(forStatementRegex) && tempArray[i].match(/\:$/)) {
                if (firstBlock === true) {
                    tempIngredientSplitList[0] = {
                        for: tempArray[i],
                        blockNumber: 0,
                        ingredients: [{ ingredientAmount: '', ingredientName: '', ingredientUnit: '', ingredientId: 1 }]
                    }
                    firstBlock = false;
                    console.log(tempIngredientSplitList[0])
                } /*else {
                    counter++
                    tempIngredientSplitList[counter] = {
                        for: tempArray[i],
                        blockNumber: counter,
                        ingredients: [{ ingredientAmount: '', ingredientName: '', ingredientUnit: '', ingredientId: 1 }]
                    }
                    firstIngredient = true;
                } 
            } else {
                if (firstIngredient === true) {
                    var match: any = tempArray[i].match(/[A-Za-z]/)
                    var index = tempArray[i].indexOf(match[0])
                    tempAmount = tempArray[i].substring(0, index).trim()
                    if (tempArray[i].match(unitRegex)) {
                        const temp: any = tempArray[i].match(unitRegex)
                        tempUnit = temp[0]
                        index = index + tempUnit.length
                    } else {
                        tempUnit = ''
                    }
                    tempName = tempArray[i].substring(index, tempArray[i].length).trim()
                    tempIngredientSplitList[counter].ingredients[0] = {
                        ingredientAmount: tempAmount,
                        ingredientUnit: tempUnit,
                        ingredientName: tempName,
                        ingredientId: 1,
                    }
                    firstIngredient = false
                } else {
                    var match: any = tempArray[i].match(/[A-Za-z]/)
                    var index = tempArray[i].indexOf(match[0])
                    tempAmount = tempArray[i].substring(0, index).trim()
                    if (tempArray[i].match(unitRegex)) {
                        const temp: any = tempArray[i].match(unitRegex)
                        tempUnit = temp[0]
                        index = index + tempUnit.length
                    } else {
                        tempUnit = ''
                    }
                    tempName = tempArray[i].substring(index, tempArray[i].length).trim()
                    tempIngredientSplitList[counter].ingredients[tempIngredientSplitList[counter].ingredients.length] = {
                        ingredientAmount: tempAmount,
                        ingredientUnit: tempUnit,
                        ingredientName: tempName,
                        ingredientId: tempIngredientSplitList[counter].ingredients.length+1,
                    }
                }
            }
        }
        console.log(tempIngredientSplitList)
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList:  tempIngredientSplitList
            }
        })
    } */
  /*
  const listRecipeStepBlocks = tempRecipe.recipeStepList.map(
    (recipeStepBlock) => {
      return (
        <EditRecipeSubBlock
          setTempRecipe={setTempRecipe}
          recipeStepBlock={recipeStepBlock}
          tempRecipe={tempRecipe}
          key={recipeStepBlock.blockNumber}
        />
      );
    }
  );
*/

  const listRecipeStepBlocks = state.inputRecipe.recipeStepList
    .get()
    .map((recipeStepBlock) => {
      return (
        <RecipeInputRecipeSubBlock
          recipeStepBlock={recipeStepBlock}
          key={recipeStepBlock.blockNumber}
        />
      );
    });

  const listIngredientBlocks = state.inputRecipe.ingredientList
    .get()
    .map((ingredientBlock) => {
      return (
        <RecipeInputIngredientSubBlock
          ingredientBlock={ingredientBlock}
          key={ingredientBlock.blockNumber}
        />
      );
    });
  /*
  const addNewRecipeStepBlock = () => {
    let tempRecipeStepListAddition = tempRecipe.recipeStepList;
    let block: RecipeStepBlock = {
      for: "",
      steps: [{ recipeStepNumber: 1, recipeStepText: "" }],
      blockNumber: tempRecipe.recipeStepList.length,
    };
    tempRecipeStepListAddition.push(block);
    setTempRecipe((prev) => {
      return {
        ...prev,
        recipeStepList: tempRecipeStepListAddition,
      };
    });
  };
*/

  const addNewRecipeStepBlock = () => {
    const length = state.inputRecipe.recipeStepList.length;
    state.inputRecipe.recipeStepList[length].set({
      for: "",
      blockNumber: length,
      steps: [
        {
          recipeStepNumber: 1,
          recipeStepText: "",
        },
      ],
    });
  };
  /*
  const addNewIngredientBlock = () => {
    let tempIngredientListAddition = tempRecipe.ingredientList;
    let block: IngredientBlock = {
      for: "",
      ingredients: [
        {
          ingredientName: "",
          ingredientAmount: "",
          ingredientId: 1,
          ingredientUnit: "",
        },
      ],
      blockNumber: tempRecipe.ingredientList.length,
    };
    tempIngredientListAddition.push(block);
    setTempRecipe((prev) => {
      return {
        ...prev,
        ingredientList: tempIngredientListAddition,
      };
    });
  };
*/

  const addNewIngredientBlock = () => {
    const length = state.inputRecipe.ingredientList.length;
    state.inputRecipe.ingredientList[length].set({
      for: "",
      blockNumber: length,
      ingredients: [
        {
          ingredientId: 1,
          ingredientAmount: "",
          ingredientName: "",
          ingredientUnit: "",
        },
      ],
    });
  };

  /*
  const deleteLastRecipeStepBlock = () => {
    let tempRecipeStepListSubtraction = tempRecipe.recipeStepList;
    tempRecipeStepListSubtraction.pop();
    setTempRecipe((prev) => {
      return {
        ...prev,
        recipeStepList: tempRecipeStepListSubtraction,
      };
    });
  };
*/

  const deleteLastRecipeStepBlock = () => {
    const length = state.inputRecipe.recipeStepList.length;
    state.inputRecipe.recipeStepList[length - 1].set(none);
  };

  const deleteLastIngredientBlock = () => {
    const length = state.inputRecipe.ingredientList.length;
    state.inputRecipe.ingredientList[length - 1].set(none);
  };
  /*
  const deleteLastIngredientBlock = () => {
    let tempIngredientListSubtraction = tempRecipe.ingredientList;
    tempIngredientListSubtraction.pop();
    setTempRecipe((prev) => {
      return {
        ...prev,
        ingredientList: tempIngredientListSubtraction,
      };
    });
  };
*/
  const uploadRecipe = async () => {
    if (
      tempRecipe.recipeName &&
      tempRecipe.recipeStepList.length > 0 &&
      tempRecipe.ingredientList.length > 0
    ) {
      setUploading(true);
      if (confirm("Upload Recipe?")) {
        if (tempImageFile) {
          const imageRef = ref(
            storage,
            `${user?.email}/${tempImageFile.name + v4()}`
          );
          new Compressor(tempImageFile, {
            quality: 0.2,
            success(result) {
              uploadBytes(imageRef, result)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((url) =>
                  setTempRecipe((prev) => {
                    return {
                      ...prev,
                      imgPath: url,
                    };
                  })
                );
            },
          });
        } else {
          await addDoc(
            collection(db, `${user?.email}`, "recipeCollection", "recipes"),
            tempRecipe
          ).then(() => setUploading(false));
        }
      }
    }
  };

  const handleImgPreview = (e: any) => {
    setTempImageFile(e.target.files[0]);
    setTempImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    if (uploading) {
      addDoc(
        collection(db, `${user?.email}`, "recipeCollection", "recipes"),
        tempRecipe
      ).then(() => setUploading(false));
    }
  }, [tempRecipe.imgPath]);

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.recipeName.set(e.target.value);
  };

  return (
    <>
      <Card sx={{ margin: 5, padding: 5 }}>
        <TextField
          helperText="Recipe Name"
          value={state.inputRecipe.recipeName.get()}
          onChange={handleNameChange}
        ></TextField>
        <ButtonGroup>
          <Button style={{ fontSize: 12 }} onClick={addNewRecipeStepBlock}>
            Add New Recipe Step Block
          </Button>
          <Button onClick={deleteLastRecipeStepBlock}>
            Delete Last Recipe Step Block
          </Button>
          <Button onClick={addNewIngredientBlock}>
            Add New Ingredient Block
          </Button>
          <Button onClick={deleteLastIngredientBlock}>
            Delete Last Ingredient Block
          </Button>
        </ButtonGroup>
        <Button onClick={uploadRecipe}>Upload Recipe</Button>
        <input type="file" onChange={handleImgPreview}></input>
        {tempImagePreview ? (
          <img src={tempImagePreview} style={{ height: 150, width: 150 }}></img>
        ) : null}
        {uploading ? <h3>Uploading, please do not leave the page</h3> : null}
      </Card>
      <Card sx={{ margin: 5, padding: 5 }}>
        <Grid container spacing={0}>
          <Grid item xs={7}>
            {state.inputRecipe.ingredientList.get()
              ? listIngredientBlocks
              : null}
          </Grid>
          <Grid item xs={5}>
            {state.inputRecipe.recipeStepList.get()
              ? listRecipeStepBlocks
              : null}
          </Grid>
        </Grid>
      </Card>
      <CurrentRecipe currentRecipe={state.inputRecipe.get()} />
      {/*}    <TextField multiline onChange={(e) => setSplitArrayInput(e.target.value)} value={splitArrayInput} sx={{ width: 1000, height: 500 }}/>
        <Button onClick={handleRecipeStepSplit} >Split String</Button>
        <Button onClick={handleIngredientSplit} >Split Ingredients</Button> */}
    </>
  );
};

export default RecipeInputComp;
