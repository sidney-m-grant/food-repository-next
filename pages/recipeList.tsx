import React, { useState, useEffect } from 'react'
import SignOutButton from '../components/SignOutButton'
import { useRouter } from 'next/router'
import CurrentRecipe from '../components/CurrentRecipe'
import IndividualRecipe from '../components/IndividualRecipe'
import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import RadioOption from '../components/RadioOption'
import Fuse from 'fuse.js'
import Link from 'next/link'
import EditRecipe from '../components/EditRecipe'

export type RecipeStep = {
    recipeStepText: string;
    recipeStepNumber: number;
  }
  
  export type Ingredient = {
    ingredientName: string;
    ingredientAmount: string;
    ingredientUnit: string;
    ingredientId: number;
  }
  
  export type Recipe = {
    recipeName: string;
    docId?: string;
    recipeStepList: RecipeStep[];
    ingredientList: Ingredient[];
  }

export const RecipeList = () => {

    const router = useRouter()
    const { user } = useAuth()

    const dummyRecipe: Recipe = {
        recipeName: '',
        recipeStepList: [{
            recipeStepNumber: 1,
            recipeStepText: ''
        }],
        ingredientList: [{
            ingredientAmount: '',
            ingredientId: 1,
            ingredientName: '',
            ingredientUnit: '',
        }]
    }

    const [listOfFriends, setListOfFriends] = useState<string[]>([user?.email])
    const [selectedOption, setSelectedOption] = useState<string>(user.email)
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
    const [currentRecipe, setCurrentRecipe] = useState<Recipe>(dummyRecipe);
    const [editedRecipe, setEditedRecipe] = useState<Recipe>(dummyRecipe);
    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        const getFriendList = async () => {
          const friendListObject = await getDoc(doc(db, user?.email, "social", "socialItems", "friendListArray"))
          const friendListArray = friendListObject.data()?.friendList
          friendListArray.push(user?.email)
          setListOfFriends(friendListArray)
        }
        getFriendList()
      }, [])

    useEffect(() => {
        const getRecipes = async () => {
            const recipes = await getDocs(collection(db, selectedOption, 'recipeCollection', 'recipes'))
            const tempArray: any = recipes.docs.map((doc) => ({ docId: doc.id, ...doc.data() }))
            const recipeArray: Recipe[] = []
            tempArray.forEach((recipe: Recipe) => {
                const temp: Recipe = {
                    recipeName: recipe.recipeName,
                    recipeStepList: recipe.recipeStepList,
                    ingredientList: recipe.ingredientList,
                    docId: recipe.docId,
                }
                recipeArray.push(temp)
            })
            setAllRecipes(recipeArray)
        }
        getRecipes()
        setCurrentRecipe(dummyRecipe)
    }, [selectedOption])
  
    const fuse = new Fuse(allRecipes, {
        keys: [
            'recipeName',
            'ingredientList.ingredientName'
        ]
      })
    
    const results = fuse.search(searchInput)
    const recipeResults = searchInput ? results.map(result => result.item) : allRecipes;

    const listItems = recipeResults.map((recipe: Recipe) => {
        return <IndividualRecipe recipe={recipe} key={allRecipes.indexOf(recipe)} setCurrentRecipe={setCurrentRecipe} setEditedRecipe={setEditedRecipe} dummyRecipe={dummyRecipe} />
    })

    const listFriendRadioOptions = listOfFriends.map((friend: string) => {
        return <RadioOption friend={friend} key={listOfFriends.indexOf(friend)} setSelectedOption={setSelectedOption} ></RadioOption>
    })

    return (
    <>
        <div>
            <input placeholder="Search Bar" onChange={(e) => setSearchInput(e.target.value)}></input>
        </div>
        <div className="recipe-list-container">
            {currentRecipe.recipeName ? <CurrentRecipe currentRecipe={currentRecipe}/> : null}
            {editedRecipe.recipeName ? <EditRecipe editedRecipe={editedRecipe}/> : null}
            {listItems}
        </div>
        <div className="friend-radio-options-container">
            {listFriendRadioOptions}
        </div>
        <div>
            <Link href="/recipeInput">
                <button>To Recipe Input</button>
            </Link>
            <Link href="/social">
                <button>To Social</button>
            </Link>
            <SignOutButton />
        </div>
    </>
    )
}

export default RecipeList
