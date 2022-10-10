import React, { useState, useEffect } from "react";
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
import { ButtonGroup, Card, Button } from "@mui/material";
import { useState as useStateHookstate, none } from "@hookstate/core";
import { store } from "../store";

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
      setUploading(true);
      if (tempImageFile) {
        if (state.editedRecipe.imgPath.get()) {
          deleteImage(state.editedRecipe.imgPath.get());
        }
        const imageRef = ref(
          storage,
          `${user?.email}/${tempImageFile.name + v4()}`
        );
        new Compressor(tempImageFile, {
          quality: 0.4,
          success(result) {
            uploadBytes(imageRef, result)
              .then((snapshot) => getDownloadURL(snapshot.ref))
              .then((url) => state.editedRecipe.imgPath.set(url));
          },
        });
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
      }
    } else {
      alert(
        "recipes must have a name and at least one ingredient and step each, edit failed"
      );
    }
  };

  useEffect(() => {
    if (uploading) {
      setDoc(
        doc(
          db,
          `${user?.email}`,
          "recipeCollection",
          "recipes",
          `${state.editedRecipe.docId.get()}`
        ),
        state.editedRecipe.get()
      ).then(() => setToggleFetchRecipes(!toggleFetchRecipes));
      setUploading(false);
    }
  }, [state.editedRecipe.imgPath.get()]);

  const handleImgPreview = (e: any) => {
    if (e.target.files[0]) {
      setTempImageFile(e.target.files[0]);
      setTempImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setTempImageFile(null);
      setTempImagePreview("");
    }
  };

  return (
    <>
      <Card>
        {state.editedRecipe.recipeName.get()}
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
        </ButtonGroup>{" "}
        <br />
        <Button onClick={uploadFinishedRecipe}>Upload Recipe</Button>
        <input type="file" onChange={handleImgPreview}></input>
        {tempImagePreview ? (
          <img src={tempImagePreview} style={{ height: 150, width: 150 }}></img>
        ) : null}
        {uploading ? <h3>Uploading, please do not leave the page</h3> : null}
      </Card>
      <div className="recipe-container">
        <div className="ingredient-list">{listIngredientBlocks}</div>
        <div className="recipe-steps">{listRecipeStepBlocks}</div>
      </div>
      <CurrentRecipe currentRecipe={state.editedRecipe.get()} />
    </>
  );
};

export default EditRecipe;
