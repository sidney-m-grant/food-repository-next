import React, { useState } from "react";
import CurrentRecipe from "../RecipeComponents/CurrentRecipe";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "../../firebase";
import EditRecipeSubBlock from "./EditRecipeSubBlock";
import EditIngredientSubBlock from "./EditIngredientSubBlock";
import { v4 } from "uuid";
import Compressor from "compressorjs";
import { Card, Button, TextField, Grid, List, ListItem } from "@mui/material";
import { useState as useStateHookstate, none } from "@hookstate/core";
import { store } from "../store";
import EditButtonGroup from "../UIComponents/EditButtonGroup";
import clone from "just-clone";

interface Props {
  toggleFetchRecipes: boolean;
  setToggleFetchRecipes: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRecipe: React.FC<Props> = ({
  setToggleFetchRecipes,
  toggleFetchRecipes,
}) => {
  const { user } = useAuth();
  const state = useStateHookstate(store);

  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

  const listRecipeStepBlocks = state.editedRecipe.recipeStepList
    .get()
    .map((recipeStepBlock) => {
      return (
        <EditRecipeSubBlock
          recipeStepBlock={recipeStepBlock}
          key={recipeStepBlock.blockNumber}
        />
      );
    });

  const listIngredientBlocks = state.editedRecipe.ingredientList
    .get()
    .map((ingredientBlock) => {
      return (
        <EditIngredientSubBlock
          ingredientBlock={ingredientBlock}
          key={ingredientBlock.blockNumber}
        />
      );
    });

  const handleAddToCollection = () => {
    if (!collectionInput) return;
    const length = state.editedRecipe.collections.length;
    if (state.editedRecipe.collections[0].collectionName.get() === "") {
      state.editedRecipe.collections[0].collectionName.set(collectionInput);
    } else {
      state.editedRecipe.collections[length].set({
        collectionId: length,
        collectionName: collectionInput,
      });
    }
    setCollectionInput("");
  };

  const handleAddToTags = () => {
    if (!tagInput) return;
    const length = state.editedRecipe.tags.length;
    if (state.editedRecipe.tags[0].tagName.get() === "") {
      state.editedRecipe.tags[0].tagName.set(tagInput);
    } else {
      state.editedRecipe.tags[length].set({ tagId: length, tagName: tagInput });
    }
    setTagInput("");
  };

  const handleDeleteLastCollection = () => {
    const length = state.editedRecipe.collections.length;
    if (length > 1) {
      state.editedRecipe.collections[length - 1].set(none);
    }
    if (length === 1) {
      state.editedRecipe.collections[0].collectionName.set("");
    }
  };

  const handleDeleteLastTag = () => {
    const length = state.editedRecipe.tags.length;
    if (length > 1) {
      state.editedRecipe.tags[length - 1].set(none);
    }
    if (length === 1) {
      state.editedRecipe.tags[0].tagName.set("");
    }
  };

  const addNewRecipeStepBlock = () => {
    const length = state.editedRecipe.recipeStepList.length;
    state.editedRecipe.recipeStepList[length].set({
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
    const length = state.editedRecipe.ingredientList.length;
    state.editedRecipe.ingredientList[length].set({
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
    const length = state.editedRecipe.recipeStepList.length;
    state.editedRecipe.recipeStepList[length - 1].set(none);
  };

  const deleteLastIngredientBlock = () => {
    const length = state.editedRecipe.ingredientList.length;
    state.editedRecipe.ingredientList[length - 1].set(none);
  };

  const deleteImage = async (imgPath: string | undefined) => {
    const deleteRef = ref(storage, imgPath);
    await deleteObject(deleteRef);
  };

  const uploadFinishedRecipe = async () => {
    if (
      state.editedRecipe.recipeName.get() &&
      state.editedRecipe.ingredientList.get().length > 0 &&
      state.editedRecipe.recipeStepList.get().length > 0
    ) {
      if (confirm("Upload edited Recipe?")) {
        setUploading(true);
        if (tempImageFile) {
          const imgToDelete = state.editedRecipe.imgPath.get();
          let tempObject = clone(state.editedRecipe.get());
          const imageRef = ref(
            storage,
            `${user?.email}/${tempImageFile.name + v4()}`
          );
          new Compressor(tempImageFile, {
            quality: 0.4,
            success(result) {
              uploadBytes(imageRef, result)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((url) => (tempObject.imgPath = url))
                .then(() =>
                  setDoc(
                    doc(
                      db,
                      `${user?.email}`,
                      "recipeCollection",
                      "recipes",
                      `${tempObject.docId}`
                    ),
                    tempObject
                  )
                );
            },
          });
          if (imgToDelete) {
            deleteImage(imgToDelete);
          }
          setToggleFetchRecipes(!toggleFetchRecipes);
          setUploading(false);
        } else {
          setDoc(
            doc(
              db,
              `${user?.email}`,
              "recipeCollection",
              "recipes",
              `${state.editedRecipe.docId.get()}`
            ),
            state.editedRecipe.get()
          ).then(() => setUploading(false));
          setToggleFetchRecipes(!toggleFetchRecipes);
        }
      }
    } else {
      alert(
        "recipes must have a name and at least one ingredient and step each, edit failed"
      );
    }
  };

  const handleImgPreview = (e: any) => {
    if (e.target.files[0]) {
      setTempImageFile(e.target.files[0]);
      setTempImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setTempImageFile(null);
      setTempImagePreview("");
    }
  };

  const handlePrepTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.prepTime.set(e.target.value);
  };

  const handleServesAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.servesAmount.set(e.target.value);
  };

  const handleActiveCookingTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.activeCookingTime.set(e.target.value);
  };

  const handleTotalTimeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.totalTime.set(e.target.value);
  };

  const handleSourceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.source.set(e.target.value);
  };

  const handleBriefDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    state.editedRecipe.briefDescription.set(e.target.value);
  };

  const collectionList = state.editedRecipe.collections
    .get()
    .map((collection) => {
      return (
        <ListItem key={collection.collectionId}>
          {collection.collectionName}
        </ListItem>
      );
    });

  const tagList = state.editedRecipe.tags.get().map((tag) => {
    return <ListItem key={tag.tagId}>{tag.tagName}</ListItem>;
  });

  return (
    <>
      <Card>
        <Card sx={{ padding: 1, margin: 1, display: "inline-flex" }}>
          {state.editedRecipe.recipeName.get()}
        </Card>
        <TextField
          helperText="Serves Amount"
          value={state.editedRecipe.servesAmount.get()}
          onChange={handleServesAmountChange}
        ></TextField>
        <TextField
          helperText="Source"
          value={state.editedRecipe.source.get()}
          onChange={handleSourceChange}
        ></TextField>
        <TextField
          helperText="Prep Time"
          value={state.editedRecipe.prepTime.get()}
          onChange={handlePrepTimeChange}
        ></TextField>
        <TextField
          helperText="Total Time"
          value={state.editedRecipe.totalTime.get()}
          onChange={handleTotalTimeChange}
        ></TextField>
        <TextField
          helperText="Active Cooking Time"
          value={state.editedRecipe.activeCookingTime.get()}
          onChange={handleActiveCookingTimeChange}
        ></TextField>
        <TextField
          helperText="Brief Description"
          value={state.editedRecipe.briefDescription.get()}
          onChange={handleBriefDescriptionChange}
          multiline
        ></TextField>
        <EditButtonGroup
          addNewRecipeStepBlock={addNewRecipeStepBlock}
          deleteLastRecipeStepBlock={deleteLastRecipeStepBlock}
          addNewIngredientBlock={addNewIngredientBlock}
          deleteLastIngredientBlock={deleteLastIngredientBlock}
        />

        <Button onClick={uploadFinishedRecipe}>Upload Recipe</Button>
        <input type="file" onChange={handleImgPreview}></input>
        {tempImagePreview ? (
          <Card sx={{ margin: 1, padding: 1, display: "inline-flex" }}>
            <img
              src={tempImagePreview}
              style={{ height: 150, width: 150 }}
            ></img>
          </Card>
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
          {state.editedRecipe.collections.get() ? collectionList : null}
        </List>
        <List>{state.editedRecipe.tags.get() ? tagList : null}</List>
      </Card>
      <Card sx={{ margin: 5, padding: 5 }}>
        <Grid container spacing={0}>
          <Grid item xs={7}>
            {state.editedRecipe.ingredientList.get()
              ? listIngredientBlocks
              : null}
          </Grid>
          <Grid item xs={5}>
            {state.editedRecipe.recipeStepList.get()
              ? listRecipeStepBlocks
              : null}
          </Grid>
        </Grid>
      </Card>
      <CurrentRecipe currentRecipe={state.editedRecipe.get()} />
    </>
  );
};

export default EditRecipe;
