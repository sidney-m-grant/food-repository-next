import React, { useState, useEffect } from 'react'
import SignOutButton from '../components/SignOutButton'
import { useRouter } from 'next/router'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

type RecipeStep = {
    recipeStepText: string;
    recipeStepNumber: number;
}

type Ingredient = {
    ingredientName: string;
    ingredientAmount: string;
    ingredientUnit: string;
    ingredientId: number;
}

type Recipe = {
    recipeName: string;
    recipeId: number;
    recipeImg: string;
    recipeText: RecipeStep[];
    ingredientList: Ingredient[];
}

const initialState: Recipe = { 
    recipeName: 'No Recipe Selected', 
    recipeImg: "", 
    recipeId: 0, 
    recipeText: [{
      recipeStepNumber: 1, 
      recipeStepText: ''
    }], 
    ingredientList: [{
      ingredientName: '', 
      ingredientAmount: '', 
      ingredientUnit: '', 
      ingredientId: 1
    }] 
  }

const RecipeList = () => {

    const recipesCollectionRef = collection(db, 'Recipes')

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])

    const router = useRouter()
{/*
    useEffect(() => {
    const recipesArray: Recipe[] = [];
        const getData = async () => {
        const recipes = await getDocs(recipesCollectionRef);
        recipes.forEach((doc) => {
            const temp = doc.data();
            const recipeToAdd: Recipe = {
                recipeName: temp.recipeName,
                recipeImg: temp.recipeImg,
                recipeId: temp.recipeId,
                recipeText: temp.recipeText,
                ingredientList: temp.ingredientList,
            }
            recipesArray.push(recipeToAdd);
        })
        getData()
        setAllRecipes(recipesArray)
      }
    }, [])
    
    const recipesListItems = allRecipes.map((recipe) => {
        return (
            <h5 key={recipe.recipeId}>{recipe.recipeName}</h5>
        )
    })
*/}

    useEffect(() => {
        const getRecipes = async () => {
            const recipes = await getDocs(recipesCollectionRef)
            const tempArray = recipes.docs.map((doc) => ({
                ...doc.data()
            }))
            const recipeArray: Recipe[] = []
            tempArray.forEach((recipe) => {
                const temp: Recipe = {
                    recipeName: recipe.recipeName,
                    recipeImg: recipe.recipeImg,
                    recipeId: recipe.recipeId,
                    recipeText: recipe.recipeStepList,
                    ingredientList: recipe.ingredientList,
                }
                recipeArray.push(temp)
            })
            setAllRecipes(recipeArray)
        }
        getRecipes()
    }, [])

    return (
        <div>
            <SignOutButton />
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
        </div>
    )
}

export default RecipeList
