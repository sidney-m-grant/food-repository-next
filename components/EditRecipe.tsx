import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStep, Ingredient } from '../pages/recipeList'
import CurrentRecipe from './CurrentRecipe'
import EditIngredientSub from './EditIngredientSub'
import EditRecipeSub from './EditRecipeSub'
import { setDoc, doc, } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'


interface Props {
  editedRecipe: Recipe
}

const EditRecipe: React.FC<Props> = ({ editedRecipe }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(editedRecipe)

    const listRecipeSteps = tempRecipe.recipeStepList.map((recipeStep) => {
        return <EditRecipeSub setTempRecipe={setTempRecipe} recipeStep={recipeStep} recipe={tempRecipe} key={recipeStep.recipeStepNumber}/>
    })

    const listIngredients = tempRecipe.ingredientList.map((ingredient) => {
        return <EditIngredientSub setTempRecipe={setTempRecipe} ingredient={ingredient} recipe={tempRecipe} key={ingredient.ingredientId}/>
    })

    useEffect(() => {
        setTempRecipe(editedRecipe)
    }, [editedRecipe])

    const handleAddTempRecipeStep = () => {
        let tempRecipeAddition = tempRecipe.recipeStepList;
        tempRecipeAddition.push({ recipeStepNumber: tempRecipe.recipeStepList.length+1, recipeStepText: '' })
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempRecipeAddition
            }
        })
    }

    const handleDeleteLastRecipeStep = () => {
        let tempRecipeSubtraction = tempRecipe.recipeStepList;
        tempRecipeSubtraction.pop();
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempRecipeSubtraction
            }
        })
    }

    const handleAddTempIngredient = () => {
        let tempIngredientAddition = tempRecipe.ingredientList;
        tempIngredientAddition.push({ingredientId: tempRecipe.ingredientList.length+1, ingredientAmount: '', ingredientName: '', ingredientUnit: ''})
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList: tempIngredientAddition
            }
        })
    }

    const handleDeleteLastIngredient = () => {
        let tempIngredientSubtraction = tempRecipe.ingredientList;
        tempIngredientSubtraction.pop();
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList: tempIngredientSubtraction
            }
        })
    }

    const uploadFinishedRecipe = async () => {
        
        if (tempRecipe.recipeName && tempRecipe.ingredientList.length > 0 && tempRecipe.recipeStepList.length > 0 && tempRecipe.recipeStepList[tempRecipe.recipeStepList.length - 1].recipeStepText && tempRecipe.ingredientList[tempRecipe.ingredientList.length -1].ingredientName) {
            await setDoc(doc(db, `${user?.email}`, 'recipeCollection', 'recipes', `${tempRecipe.docId}`), tempRecipe)
            alert('edits uploaded')
        } else {
            alert('invalid recipe, upload failed')
        }
    } 


  return (
    <>
        <div>
            {editedRecipe.recipeName}
        </div>
        <div>
            <button onClick={handleDeleteLastRecipeStep}>Delete Last Step</button>
            <button onClick={handleDeleteLastIngredient}>Delete Last Ingredient</button>
            <button onClick={handleAddTempRecipeStep}>Add New Step</button>
            <button onClick={handleAddTempIngredient}>Add New Ingredient</button>
        </div>
        <div className="recipe-container">
            <div className="ingredient-list">
                {listIngredients}
            </div>
            <div className="recipe-steps">
                {listRecipeSteps}
            </div>
        </div>
        <CurrentRecipe currentRecipe={tempRecipe} />
        <button onClick={uploadFinishedRecipe}>Upload Finished Recipe</button>
    </>
  )
}

export default EditRecipe