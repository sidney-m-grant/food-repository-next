import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { Recipe, RecipeStep, Ingredient } from '../pages/recipeList'
import { addDoc, collection } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext' 
import { db } from '../firebase'
import SignOutButton from '../components/SignOutButton'
import Link from 'next/link'

const RecipeInput = () => {

    const { user } = useAuth()
    const router = useRouter()

    const [tempRecipeStep, setTempRecipeStep] = useState<string>("")
    const [tempRecipeStepArray, setTempRecipeStepArray] = useState<RecipeStep[]>([])

    const [tempIngredientName, setTempIngredientName] = useState<string>("")
    const [tempIngredientAmount, setTempIngredientAmount] = useState<string>("")
    const [tempIngredientUnit, setTempIngredientUnit] = useState<string>("")
    const [tempIngredientArray, setTempIngredientArray] = useState<Ingredient[]>([])

    const [tempRecipeName, setTempRecipeName] = useState<string>("")

    const [tempRecipe, setTempRecipe] = useState<Recipe | null>(null)

        // final upload
    const uploadFinishedRecipe = async () => {
        if (tempRecipe){
            await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
        }
    } 

        // called on button press, adds the current recipe step to an array
    const handleAddTempRecipeStep = () => {
        if (tempRecipeStep) {
            const objectToAdd: RecipeStep = {
                recipeStepText: tempRecipeStep, 
                recipeStepNumber: tempRecipeStepArray.length+1
            }
            setTempRecipeStepArray(tempRecipeStepArray => [...tempRecipeStepArray, objectToAdd])
            setTempRecipeStep("");
        } else {
            alert('invalid recipe step')
        }
    }
        // called on button press, adds the current ingredient to an array
    const handleAddTempIngredient = () => {
        if (tempIngredientName && tempIngredientAmount) {
            const objectToAdd: Ingredient = {
                ingredientName: tempIngredientName,
                ingredientAmount: tempIngredientAmount,
                ingredientUnit: tempIngredientUnit,
                ingredientId: tempIngredientArray.length+1,
            }
            setTempIngredientArray(tempIngredientArray => [...tempIngredientArray, objectToAdd])
            setTempIngredientAmount("")
            setTempIngredientName("")
            setTempIngredientUnit("")
        } else {
            alert ('invalid ingredient')
        }
    }

        // delete last recipe step
    const handleRemoveLastTempRecipeStep = () => {
        setTempRecipeStepArray((tempArray) => (tempArray.slice(0, -1)))
    }

        // delete last ingredient
    const handleRemoveLastTempIngredient = () => {
        setTempIngredientArray((tempArray) => (tempArray.slice(0, -1)))
    }

    const recipeStepListItems = tempRecipeStepArray.map(step => {
        return <p key={step.recipeStepNumber}>{step.recipeStepNumber}. {step.recipeStepText}</p>
    })

    const ingredientListItems = tempIngredientArray.map(ingredient => {
        return <p key={ingredient.ingredientId}>{ingredient.ingredientName} {ingredient.ingredientAmount} {ingredient.ingredientUnit}</p>
    })

    const uploadRecipe = () => {
        if (tempRecipeName && tempRecipeStepArray.length > 0 && tempIngredientArray.length > 0) {
            const newRecipe: Recipe = {
                recipeName: tempRecipeName,
                recipeStepList: tempRecipeStepArray,
                ingredientList: tempIngredientArray,
            }
            setTempRecipe(newRecipe)
            setTempRecipeName("")
        } else {
            alert('upload failed')
        }
    }

    useEffect(() => {
        if (tempRecipe) {
            try {
                uploadFinishedRecipe().then((reponse) => {
                    setTempRecipe(null)
                    setTempIngredientArray([])
                    setTempRecipeStepArray([])
                })
                alert('file uploaded')
            } catch (e) {
                alert('error')
            }
        }
    }, [tempRecipe])

  return (
    <>
        <div className="recipe-step-input-container">
            <textarea className="recipe-step-input" placeholder="Recipe Text" onChange={(e) => setTempRecipeStep(e.target.value)} value={tempRecipeStep} ></textarea>
            <button onClick={handleAddTempRecipeStep}>Add Recipe Step</button>
            
        </div>
        <div style={{ padding: 10, margin: 10 }}>
            <input placeholder="Ingredient Name" onChange={(e) => setTempIngredientName(e.target.value)} value={tempIngredientName} ></input>
            <input placeholder="Ingredient Amount" onChange={(e) => setTempIngredientAmount(e.target.value)} value={tempIngredientAmount}></input>
            <input placeholder="Ingredient Unit" onChange={(e) => setTempIngredientUnit(e.target.value)} value={tempIngredientUnit}></input>
            <button onClick={handleAddTempIngredient}>Add Ingredient</button>
        </div>

        <button onClick={handleRemoveLastTempRecipeStep} style={{ padding: 10, margin: 10 }}>Remove Last Recipe Step</button>
        <button onClick={handleRemoveLastTempIngredient} style={{ padding: 10, margin: 10 }}>Remove Last Ingredient</button>

        <div className="recipe-container">
            <div className="ingredient-list">
                {ingredientListItems}
            </div>
            <div className="recipe-steps">
                 {recipeStepListItems}
            </div>
        </div>
        <div style={{ padding: 10, margin: 10 }}>
            <input placeholder="Recipe Name" onChange={(e) => setTempRecipeName(e.target.value)} value={tempRecipeName}></input>
            <button onClick={uploadRecipe}>Upload Recipe</button>
        </div>
        
        <div style={{ padding: 10, margin: 10 }}>
            <Link href="/recipeList">
                <button>To Recipe List</button>
            </Link>
            <Link href="/social">
                <button>To Social</button>
            </Link>

         <SignOutButton />
        </div>

        
    </>
  )
}

export default RecipeInput