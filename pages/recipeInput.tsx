import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Recipe, RecipeStep, Ingredient, useRecipeList } from '../context/RecipeListContext'
import { addDoc } from 'firebase/firestore'

const RecipeInput = () => {

    const { allRecipes, recipesCollectionRef } = useRecipeList()
    const router = useRouter()

    const [tempRecipeStep, setTempRecipeStep] = useState<string>('')
    const [tempRecipeStepArray, setTempRecipeStepArray] = useState<RecipeStep[]>([])

    const [tempIngredientName, setTempIngredientName] = useState('')
    const [tempIngredientAmount, setTempIngredientAmount] = useState('')
    const [tempIngredientUnit, setTempIngredientUnit] = useState('')
    const [tempIngredientArray, setTempIngredientArray] = useState<Ingredient[]>([])

    const [tempRecipeName, setTempRecipeName] = useState('')

    const [tempRecipe, setTempRecipe] = useState<Recipe>()

    const handleAddTempRecipeStep = () => {
        const objectToAdd: RecipeStep = {
            recipeStepText: tempRecipeStep, 
            recipeStepNumber: tempRecipeStepArray.length+1
        }
        setTempRecipeStepArray(tempRecipeStepArray => [...tempRecipeStepArray, objectToAdd])
    }

    const handleAddTempIngredient = () => {
        const objectToAdd: Ingredient = {
            ingredientName: tempIngredientName,
            ingredientAmount: tempIngredientAmount,
            ingredientUnit: tempIngredientUnit,
            ingredientId: tempIngredientArray.length+1,
        }
        setTempIngredientArray(tempIngredientArray => [...tempIngredientArray, objectToAdd])
    }

    const recipeStepListItems = tempRecipeStepArray.map(step => {
        return <p key={step.recipeStepNumber}>{step.recipeStepNumber}. {step.recipeStepText}</p>
    })

    const ingredientListItems = tempIngredientArray.map(ingredient => {
        return <p key={ingredient.ingredientId}>{ingredient.ingredientName} {ingredient.ingredientAmount} {ingredient.ingredientUnit}</p>
    })

    const saveTempRecipe = () => {
        const newRecipe: Recipe = {
            recipeName: tempRecipeName,
            recipeId: allRecipes.length,
            recipeImg: '',
            recipeStepList: tempRecipeStepArray,
            ingredientList: tempIngredientArray,
        }
        setTempRecipe(newRecipe)
    }

    const uploadFinishedRecipe = async () => {
        await addDoc(recipesCollectionRef, tempRecipe)
    }


  return (
    <>
        <div>
            <textarea placeholder="Recipe Text" onChange={(e) => setTempRecipeStep(e.target.value)} ></textarea>
            <button onClick={handleAddTempRecipeStep}>Add Recipe Step</button>
            {recipeStepListItems}
        </div>

        <div>
            <input placeholder="Ingredient Name" onChange={(e) => setTempIngredientName(e.target.value)} ></input>
            <input placeholder="Ingredient Amount" onChange={(e) => setTempIngredientAmount(e.target.value)} ></input>
            <input placeholder="Ingredient Unit" onChange={(e) => setTempIngredientUnit(e.target.value)} ></input>
            <button onClick={handleAddTempIngredient}>Add Ingredient</button>
            {ingredientListItems}
        </div>

        <input placeholder="Recipe Name" onChange={(e) => setTempRecipeName(e.target.value)}></input>

        <button onClick={() => router.push('/recipeList')}>To Recipe List</button>

        <button onClick={saveTempRecipe}>Save Temp Recipe</button>
        <button onClick={uploadFinishedRecipe}>Upload Finished Recipe</button>
    </>
        

    
  )
}

export default RecipeInput