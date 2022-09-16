import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { Recipe, RecipeStep, Ingredient } from '../pages/recipeList'
import { addDoc, collection } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext' 
import { db } from '../firebase'
import SignOutButton from '../components/SignOutButton'

const RecipeInput = () => {

    const { user } = useAuth()
    const router = useRouter()

    const [tempRecipeStep, setTempRecipeStep] = useState<string>('')
    const [tempRecipeStepArray, setTempRecipeStepArray] = useState<RecipeStep[]>([])

    const [tempIngredientName, setTempIngredientName] = useState('')
    const [tempIngredientAmount, setTempIngredientAmount] = useState('')
    const [tempIngredientUnit, setTempIngredientUnit] = useState('')
    const [tempIngredientArray, setTempIngredientArray] = useState<Ingredient[]>([])

    const [tempRecipeName, setTempRecipeName] = useState('')

    const [tempRecipe, setTempRecipe] = useState<Recipe>()

    const uploadFinishedRecipe = async () => {
        if (tempRecipe){
            await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
        }
    } 

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
            recipeStepList: tempRecipeStepArray,
            ingredientList: tempIngredientArray,
        }
        setTempRecipe(newRecipe)
    }

    useEffect(() => {
        uploadFinishedRecipe()
    }, [tempRecipe?.recipeName])

  return (
    <>
        <div className="recipe-step-input-container">
            <textarea className="recipe-step-input" placeholder="Recipe Text" onChange={(e) => setTempRecipeStep(e.target.value)} ></textarea>
            <button onClick={handleAddTempRecipeStep}>Add Recipe Step</button>
            
        </div>
        <div>
            <input placeholder="Ingredient Name" onChange={(e) => setTempIngredientName(e.target.value)} ></input>
            <input placeholder="Ingredient Amount" onChange={(e) => setTempIngredientAmount(e.target.value)} ></input>
            <input placeholder="Ingredient Unit" onChange={(e) => setTempIngredientUnit(e.target.value)} ></input>
            <button onClick={handleAddTempIngredient}>Add Ingredient</button>
        </div>

        <div className="recipe-container">
            <div className="ingredient-list">
                {ingredientListItems}
            </div>
            <div className="recipe-steps">
                 {recipeStepListItems}
            </div>
        </div>

        <input placeholder="Recipe Name" onChange={(e) => setTempRecipeName(e.target.value)}></input>

        <button onClick={saveTempRecipe}>Save Temp Recipe</button>

        <div>
            <button onClick={() => router.push('/recipeList')}>To Recipe List</button>
            <button onClick={() => router.push('/social')}>To Social</button>
            <SignOutButton />
        </div>
    </>
  )
}

export default RecipeInput