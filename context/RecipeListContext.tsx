import React, { useState, useEffect, useContext, createContext } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useAuth } from './AuthContext'

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
  recipeStepList: RecipeStep[];
  ingredientList: Ingredient[];
}

const RecipeListContext = createContext({})

export const useRecipeList: any = () => useContext(RecipeListContext)

export const RecipeListContextProvider = ({children }: {children: React.ReactNode}) => {

    const { user } = useAuth()

    const userCollectionRef = collection(db, `${user?.email}`)
    const recipesCollectionRef = collection(db, `${user?.email}`, 'recipeCollection', 'recipes' )

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
    const [currentRecipe, setCurrentRecipe] = useState<Recipe>();

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
                    recipeId: recipe.recipeId,
                    recipeStepList: recipe.recipeStepList,
                    ingredientList: recipe.ingredientList,
                }
                recipeArray.push(temp)
            })
            setAllRecipes(recipeArray)
        }
        getRecipes()
    }, [user?.email])

  return (
    <RecipeListContext.Provider value={{ allRecipes, userCollectionRef, currentRecipe, setCurrentRecipe }}>
          {children}
    </RecipeListContext.Provider>
  )
}

export default RecipeListContext