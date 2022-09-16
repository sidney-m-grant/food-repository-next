import React, { useState, useEffect } from 'react'
import SignOutButton from '../components/SignOutButton'
import { useRouter } from 'next/router'
import CurrentRecipe from '../components/CurrentRecipe'
import IndividualRecipe from '../components/IndividualRecipe'
import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import RadioOption from '../components/RadioOption'

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
    recipeStepList: RecipeStep[];
    ingredientList: Ingredient[];
  }

export const RecipeList = () => {

    const router = useRouter()
    const { user } = useAuth()

    const [listOfFriends, setListOfFriends] = useState<string[]>([user?.email])
    const [selectedOption, setSelectedOption] = useState<string>(user.email)

    useEffect(() => {
        const getFriendList = async () => {
          const friendListObject = await getDoc(doc(db, user?.email, "social", "socialItems", "friendListArray"))
          const friendListArray = friendListObject.data()?.friendList
          friendListArray.push(user?.email)
          setListOfFriends(friendListArray)
        }
        getFriendList()
      }, [])

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
    const [currentRecipe, setCurrentRecipe] = useState<Recipe>();
  
    useEffect(() => {
        const getRecipes = async () => {
            const recipes = await getDocs(collection(db, selectedOption, 'recipeCollection', 'recipes'))
            const tempArray = recipes.docs.map((doc) => ({
                ...doc.data()
                }))
            const recipeArray: Recipe[] = []
            tempArray.forEach((recipe) => {
                const temp: Recipe = {
                    recipeName: recipe.recipeName,
                    recipeStepList: recipe.recipeStepList,
                    ingredientList: recipe.ingredientList,
                }
                recipeArray.push(temp)
            })
            setAllRecipes(recipeArray)
        }
        getRecipes()
    }, [selectedOption])
  

    const listItems = allRecipes.map((recipe: Recipe) => {
        return <IndividualRecipe recipe={recipe} key={allRecipes.indexOf(recipe)} setCurrentRecipe={setCurrentRecipe}/>
    })

    const listFriendRadioOptions = listOfFriends.map((friend: string) => {
        return <RadioOption friend={friend} key={listOfFriends.indexOf(friend)} setSelectedOption={setSelectedOption} ></RadioOption>
    })

    return (
    <>
        <div>
            {currentRecipe ? <CurrentRecipe currentRecipe={currentRecipe}/> : null}
            {listItems}
        </div>
        <div>
            {listFriendRadioOptions}
        </div>
        <div>
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
            <button onClick={() => router.push('/social')}>To Social</button>
            <SignOutButton />
        </div>
    </>
    )
}

export default RecipeList
