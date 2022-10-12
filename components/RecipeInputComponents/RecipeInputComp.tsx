import React, { useState, useEffect } from "react";
import CurrentRecipe from "../RecipeComponents/CurrentRecipe";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import RecipeInputRecipeSubBlock from "./RecipeInputRecipeSubBlock";
import RecipeInputIngredientSubBlock from "./RecipeInputIngredientSubBlock";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Compressor from "compressorjs";
import {
  ButtonGroup,
  Card,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { useState as useStateHookstate, none } from "@hookstate/core";
import { store } from "../store";
import EditButtonGroup from "../UIComponents/EditButtonGroup";

interface Props {}

const RecipeInputComp: React.FC<Props> = ({}) => {
  const state = useStateHookstate(store);
  const { user } = useAuth();

  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

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

  const deleteLastRecipeStepBlock = () => {
    const length = state.inputRecipe.recipeStepList.length;
    state.inputRecipe.recipeStepList[length - 1].set(none);
  };

  const deleteLastIngredientBlock = () => {
    const length = state.inputRecipe.ingredientList.length;
    state.inputRecipe.ingredientList[length - 1].set(none);
  };

  const handleAddToCollection = () => {
    if (!collectionInput) return;
    const length = state.inputRecipe.collections.length;
    if (state.inputRecipe.collections[0].collectionName.get() === "") {
      state.inputRecipe.collections[0].collectionName.set(collectionInput);
    } else {
      state.inputRecipe.collections[length].set({
        collectionId: length,
        collectionName: collectionInput,
      });
    }
    setCollectionInput("");
  };

  const handleAddToTags = () => {
    if (!tagInput) return;
    const length = state.inputRecipe.tags.length;
    if (state.inputRecipe.tags[0].tagName.get() === "") {
      state.inputRecipe.tags[0].tagName.set(tagInput);
    } else {
      state.inputRecipe.tags[length].set({ tagId: length, tagName: tagInput });
    }
    setTagInput("");
  };

  const handleDeleteLastCollection = () => {
    const length = state.inputRecipe.collections.length;
    if (length > 1) {
      state.inputRecipe.collections[length - 1].set(none);
    }
    if (length === 1) {
      state.inputRecipe.collections[0].collectionName.set("");
    }
  };

  const handleDeleteLastTag = () => {
    const length = state.inputRecipe.tags.length;
    if (length > 1) {
      state.inputRecipe.tags[length - 1].set(none);
    }
    if (length === 1) {
      state.inputRecipe.tags[0].tagName.set("");
    }
  };

  const uploadRecipe = async () => {
    if (
      state.inputRecipe.recipeName.get() &&
      state.inputRecipe.recipeStepList.get().length > 0 &&
      state.inputRecipe.ingredientList.get().length > 0
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
                .then((url) => state.inputRecipe.imgPath.set(url));
            },
          });
        } else {
          await addDoc(
            collection(db, `${user?.email}`, "recipeCollection", "recipes"),
            state.inputRecipe.get()
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
        state.inputRecipe.get()
      ).then(() => setUploading(false));
    }
  }, [state.inputRecipe.imgPath.get()]);

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.recipeName.set(e.target.value);
  };

  const handlePrepTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.prepTime.set(e.target.value);
  };

  const handleServesAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.servesAmount.set(e.target.value);
  };

  const handleActiveCookingTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.activeCookingTime.set(e.target.value);
  };

  const handleTotalTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.totalTime.set(e.target.value);
  };

  const handleSourceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.source.set(e.target.value);
  };

  const handleBriefDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.inputRecipe.briefDescription.set(e.target.value);
  };

  const collectionList = state.inputRecipe.collections
    .get()
    .map((collection) => {
      return (
        <ListItem key={collection.collectionId}>
          {collection.collectionName}
        </ListItem>
      );
    });

  const tagList = state.inputRecipe.tags.get().map((tag) => {
    return <ListItem key={tag.tagId}>{tag.tagName}</ListItem>;
  });

  return (
    <>
      <Card sx={{ margin: 5, padding: 5 }}>
        <TextField
          helperText="Recipe Name"
          value={state.inputRecipe.recipeName.get()}
          onChange={handleNameChange}
        ></TextField>
        <TextField
          helperText="Serves Amount"
          value={state.inputRecipe.servesAmount.get()}
          onChange={handleServesAmountChange}
        ></TextField>
        <TextField
          helperText="Source"
          value={state.inputRecipe.source.get()}
          onChange={handleSourceChange}
        ></TextField>
        <TextField
          helperText="Prep Time"
          value={state.inputRecipe.prepTime.get()}
          onChange={handlePrepTimeChange}
        ></TextField>
        <TextField
          helperText="Total Time"
          value={state.inputRecipe.totalTime.get()}
          onChange={handleTotalTimeChange}
        ></TextField>
        <TextField
          helperText="Active Cooking Time"
          value={state.inputRecipe.activeCookingTime.get()}
          onChange={handleActiveCookingTimeChange}
        ></TextField>
        <TextField
          helperText="Brief Description"
          value={state.inputRecipe.briefDescription.get()}
          onChange={handleBriefDescriptionChange}
          multiline
        ></TextField>
        <EditButtonGroup
          addNewIngredientBlock={addNewIngredientBlock}
          addNewRecipeStepBlock={addNewRecipeStepBlock}
          deleteLastIngredientBlock={deleteLastIngredientBlock}
          deleteLastRecipeStepBlock={deleteLastRecipeStepBlock}
        />
        <Button onClick={uploadRecipe}>Upload Recipe</Button>
        <input type="file" onChange={handleImgPreview}></input>
        {tempImagePreview ? (
          <img src={tempImagePreview} style={{ height: 150, width: 150 }}></img>
        ) : null}
        {uploading ? <h3>Uploading, please do not leave the page</h3> : null}
      </Card>
      <Card sx={{ margin: 5, padding: 5 }}>
        <TextField
          onChange={(e) => setCollectionInput(e.target.value)}
          value={collectionInput}
          helperText="Collection"
        />
        <Button onClick={handleAddToCollection}>Add To Collection</Button>
        <Button onClick={handleDeleteLastCollection}>
          Delete Last Collection
        </Button>

        <TextField
          onChange={(e) => setTagInput(e.target.value)}
          value={tagInput}
          helperText="Tags"
        ></TextField>
        <Button onClick={handleAddToTags}>Add To Tags</Button>
        <Button onClick={handleDeleteLastTag}>Delete Last Tag</Button>
        <List>
          {state.inputRecipe.collections.get() ? collectionList : null}
        </List>
        <List>{state.inputRecipe.tags.get() ? tagList : null}</List>
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
    </>
  );
};

export default RecipeInputComp;
