import React, { useState, useEffect } from "react";
import SignOutButton from "../components/UIComponents/SignOutButton";
import { useRouter } from "next/router";
import CurrentRecipe from "../components/RecipeComponents/CurrentRecipe";
import IndividualRecipe from "../components/RecipeComponents/IndividualRecipe";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import RadioOption from "../components/UIComponents/RadioOption";
import Fuse from "fuse.js";
import Link from "next/link";
import EditRecipe from "../components/EditInputComponents/EditRecipe";
import { deleteObject, ref } from "firebase/storage";
import { List, TextField, Card, Button } from "@mui/material";
import { useState as useStateHookstate } from "@hookstate/core";
import { store, dummyRecipe } from "../components/store";

export type RecipeStep = {
  recipeStepText: string;
  recipeStepNumber: number;
};

export type RecipeStepBlock = {
  for: string;
  steps: RecipeStep[];
  blockNumber: number;
};

export type IngredientBlock = {
  for: string;
  ingredients: Ingredient[];
  blockNumber: number;
};

export type Ingredient = {
  ingredientName: string;
  ingredientAmount: string;
  ingredientUnit: string;
  ingredientId: number;
};

export type Recipe = {
  recipeName: string;
  docId?: string;
  recipeStepList: RecipeStepBlock[];
  ingredientList: IngredientBlock[];
  imgPath?: string;
  prepTime?: string;
  activeCookingTime?: string;
  totalTime?: string;
  servesAmount?: string;
  source?: string;
  briefDescription?: string;
};

export const RecipeList = () => {
  const router = useRouter();
  const { user } = useAuth();
  const state = useStateHookstate(store);

  // this empty recipe just prevents type errors

  const [listOfFriends, setListOfFriends] = useState<string[]>([user?.email]);
  const [selectedOption, setSelectedOption] = useState<string>(user.email);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe>(dummyRecipe);
  const [toggleRecipeBox, setToggleRecipeBox] = useState<
    string | null | undefined
  >(null);
  const [toggleFetchRecipes, setToggleFetchRecipes] = useState<boolean>(false);

  // on rendering, fetch the users friend list users email is already contained in the friend list at index 0
  // must stay in the array in order to have your own recipes available as a radio option
  useEffect(() => {
    const getFriendList = async () => {
      const friendListObject = await getDoc(
        doc(db, user?.email, "social", "socialItems", "friendListArray")
      );
      const friendListArray = friendListObject.data()?.friendList;
      friendListArray.push(user?.email);
      setListOfFriends(friendListArray);
    };
    getFriendList();
  }, []);

  // fetch recipe list from a user based on radio input of the user and his friends
  // also attaches the auto generated docId from firestore to each recipe for use when editing
  useEffect(() => {
    const getRecipes = async () => {
      const recipes = await getDocs(
        collection(db, selectedOption, "recipeCollection", "recipes")
      );
      const tempArray: any = recipes.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      const recipeArray: Recipe[] = [];
      tempArray.forEach((recipe: Recipe) => {
        const temp: Recipe = {
          recipeName: recipe.recipeName,
          recipeStepList: recipe.recipeStepList,
          ingredientList: recipe.ingredientList,
          docId: recipe.docId,
          imgPath: recipe.imgPath,
          prepTime: recipe.prepTime,
          activeCookingTime: recipe.activeCookingTime,
          totalTime: recipe.totalTime,
          servesAmount: recipe.servesAmount,
          source: recipe.source,
          briefDescription: recipe.briefDescription,
        };
        recipeArray.push(temp);
      });
      setAllRecipes(recipeArray);
    };
    getRecipes();
  }, [selectedOption, toggleFetchRecipes]);

  const deleteRecipe = async (docId: string) => {
    await deleteDoc(
      doc(db, `${user?.email}`, "recipeCollection", "recipes", docId)
    );
  };

  const deleteImage = async (imgPath: string) => {
    const deleteRef = ref(storage, imgPath);
    await deleteObject(deleteRef);
  };

  useEffect(() => {
    if (recipeToDelete.docId) {
      if (confirm("are you sure you want to delete")) {
        deleteRecipe(recipeToDelete.docId);
        if (recipeToDelete.imgPath) {
          deleteImage(recipeToDelete.imgPath);
        }
        setAllRecipes((recipes) =>
          recipes.filter((recipe) => recipe.docId != recipeToDelete.docId)
        );
      }
    }
  }, [recipeToDelete]);

  // search bar, can search by recipe name or the name of any ingredient
  const fuse = new Fuse(allRecipes, {
    keys: ["recipeName", "ingredientList.ingredientName"],
  });

  const results = fuse.search(searchInput);
  const recipeResults = searchInput
    ? results.map((result) => result.item)
    : allRecipes;

  // maps out each individual recipe from the given list
  const listItems = recipeResults.map((recipe: Recipe) => {
    return (
      <IndividualRecipe
        recipe={recipe}
        key={allRecipes.indexOf(recipe)}
        setRecipeToDelete={setRecipeToDelete}
        toggleRecipeBox={toggleRecipeBox}
        setToggleRecipeBox={setToggleRecipeBox}
      />
    );
  });

  // maps out each radio option from the list of friends
  const listFriendRadioOptions = listOfFriends.map((friend: string) => {
    return (
      <RadioOption
        friend={friend}
        key={listOfFriends.indexOf(friend)}
        setSelectedOption={setSelectedOption}
      ></RadioOption>
    );
  });

  const handleTest = () => {
    console.log(state.editedRecipe.get());
  };

  return (
    <>
      <Card style={{ width: 217, margin: 10, padding: 10 }}>
        <TextField
          placeholder="Search Bar"
          onChange={(e) => setSearchInput(e.target.value)}
        ></TextField>
      </Card>
      <Card style={{ margin: 10, padding: 10 }}>
        {state.currentRecipe.recipeName.get() ? (
          <CurrentRecipe currentRecipe={state.currentRecipe.get()} />
        ) : null}
        {state.editedRecipe.recipeName.get() &&
        !state.currentRecipe.recipeName.get() ? (
          <EditRecipe
            setToggleFetchRecipes={setToggleFetchRecipes}
            toggleFetchRecipes={toggleFetchRecipes}
          />
        ) : null}
        <List>{listItems}</List>
      </Card>
      <Card style={{ width: 217, margin: 10, padding: 10 }}>
        {listFriendRadioOptions}
      </Card>
      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Link href="/recipeInput">
          <Button>To Recipe Input</Button>
        </Link>
        <Link href="/social">
          <Button>To Social</Button>
        </Link>
        <SignOutButton />
      </Card>
      <button onClick={handleTest}>test</button>
    </>
  );
};

export default RecipeList;
