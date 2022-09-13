import React, { useState, useEffect, useContext, createContext } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

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
  recipeId: number;
  recipeImg: string;
  recipeText: RecipeStep[];
  ingredientList: Ingredient[];
}

const RecipeListContext = createContext({})

export const useRecipeList: any = () => useContext(RecipeListContext)

export const RecipeListContextProvider = ({children }: {children: React.ReactNode}) => {

    const recipesCollectionRef = collection(db, 'Recipes')

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])

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
    <RecipeListContext.Provider value={{allRecipes, recipesCollectionRef }}>
          {children}
    </RecipeListContext.Provider>
  )
}

export default RecipeListContext