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
import { List, TextField, Card, Button, Drawer } from "@mui/material";
import { useState as useStateHookstate } from "@hookstate/core";
import { store, dummyRecipe } from "../components/store";
import type { Recipe } from "../components/store";
import RecipeCollectionForDrawer from "../components/UIComponents/RecipeCollectionForDrawer";
import RecipeTagForDrawer from "../components/UIComponents/RecipeTagForDrawer";

export const RecipeList = () => {
  const router = useRouter();
  const { user } = useAuth();
  const state = useStateHookstate(store);

  // this empty recipe just prevents type errors

  const [listOfFriends, setListOfFriends] = useState<string[]>([user?.email]);
  const [selectedOption, setSelectedOption] = useState<string>(user.email);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [toggleFetchRecipes, setToggleFetchRecipes] = useState<boolean>(false);
  const [toggleDrawer, setToggleDrawer] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

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
  }, [user.email]);

  // fetch recipe list from a user based on radio input of the user and his friends
  // also attaches the auto generated docId from firestore to each recipe for use when editing
  useEffect(() => {
    const getRecipes = async () => {
      const collectionsTemp: string[] = [];
      const tagsTemp: string[] = [];
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
          collections: recipe.collections,
          tags: recipe.tags,
        };
        for (let i = 0; i < temp.collections.length; i++) {
          if (!collectionsTemp.includes(temp.collections[i].collectionName)) {
            collectionsTemp.push(temp.collections[i].collectionName);
          }
        }
        for (let i = 0; i < temp.tags.length; i++) {
          if (!tagsTemp.includes(temp.tags[i].tagName)) {
            tagsTemp.push(temp.tags[i].tagName);
          }
        }
        recipeArray.push(temp);
      });
      setAllCollections(collectionsTemp);
      setAllTags(tagsTemp);
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

  const handleDeleteRecipeClick = (delRecipe: Recipe) => {
    if (confirm("Are you sure you want to delete")) {
      if (delRecipe.imgPath) {
        deleteImage(delRecipe.imgPath);
      }
      if (delRecipe.docId) {
        deleteRecipe(delRecipe.docId);
      }
      setAllRecipes((recipes) =>
        recipes.filter((recipe) => recipe.docId != delRecipe.docId)
      );
    }
  };

  // search bar, can search by recipe name or the name of any ingredient
  const fuse = new Fuse(allRecipes, {
    keys: ["recipeName", "ingredientList.ingredientName"],
  });

  const results = fuse.search(searchInput);
  const recipeResults = searchInput
    ? results.map((result) => result.item)
    : allRecipes;

  const recipeResultsFilteredByCollection = selectedCollection
    ? recipeResults.filter((recipe) => {
        return recipe.collections.some(
          ({ collectionName }) => collectionName === selectedCollection
        );
      })
    : recipeResults;

  const recipeResultsFilteredByTag = selectedTag
    ? recipeResultsFilteredByCollection.filter((recipe) => {
        return recipe.tags.some(({ tagName }) => tagName === selectedTag);
      })
    : recipeResultsFilteredByCollection;

  // maps out each individual recipe from the given list
  const listItems = recipeResultsFilteredByTag.map((recipe: Recipe) => {
    return (
      <IndividualRecipe
        recipe={recipe}
        key={allRecipes.indexOf(recipe)}
        handleDeleteRecipeClick={handleDeleteRecipeClick}
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

  const handleToggleDrawer = () => {
    setToggleDrawer((prev) => {
      return !prev;
    });
  };

  const listOfCollections = allCollections.map((collection) => {
    return (
      <RecipeCollectionForDrawer
        collection={collection}
        key={allCollections[allCollections.indexOf(collection)]}
        setSelectedCollection={setSelectedCollection}
        handleToggleDrawer={handleToggleDrawer}
      />
    );
  });

  const listOfTags = allTags.map((tag) => {
    return (
      <RecipeTagForDrawer
        tag={tag}
        key={allTags[allTags.indexOf(tag)]}
        setSelectedTag={setSelectedTag}
        handleToggleDrawer={handleToggleDrawer}
      />
    );
  });

  const handleSetSelectedCollectionToNull = () => {
    setSelectedCollection("");
    handleToggleDrawer();
  };

  const handleSetSelectedTagToNull = () => {
    setSelectedTag("");
    handleToggleDrawer();
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={toggleDrawer}
        onClose={handleToggleDrawer}
        PaperProps={{ style: { width: "20%" } }}
      >
        <Button onClick={handleSetSelectedCollectionToNull}>
          Dont Filter By Collection
        </Button>
        {listOfCollections}
        <Button onClick={handleSetSelectedTagToNull}>Dont Filter By Tag</Button>
        {listOfTags}
      </Drawer>
      <Button onClick={handleToggleDrawer}>Test</Button>
      <Card style={{ width: 217, margin: 10, padding: 10 }}>
        <TextField
          placeholder="Search Bar"
          onChange={(e) => setSearchInput(e.target.value)}
        ></TextField>
      </Card>
      <List>{listItems}</List>
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
    </>
  );
};

export default RecipeList;
