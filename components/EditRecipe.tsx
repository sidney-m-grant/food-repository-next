import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStepBlock, IngredientBlock } from '../pages/recipeList'
import CurrentRecipe from './CurrentRecipe'
import { setDoc, doc, } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import EditRecipeSubBlock from './EditRecipeSubBlock'
import EditIngredientSubBlock from './EditIngredientSubBlock'


interface Props {
  editedRecipe: Recipe
}

const EditRecipe: React.FC<Props> = ({ editedRecipe }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(editedRecipe)

    const listRecipeStepBlocks = tempRecipe.recipeStepList.map((recipeStepBlock) => {
        return <EditRecipeSubBlock setTempRecipe={setTempRecipe} recipeStepBlock={recipeStepBlock} tempRecipe={tempRecipe} key={recipeStepBlock.blockNumber} />
    })

    const listIngredientBlocks = tempRecipe.ingredientList.map((ingredientBlock) => {
        return <EditIngredientSubBlock setTempRecipe={setTempRecipe} ingredientBlock={ingredientBlock} tempRecipe={tempRecipe} key={ingredientBlock.blockNumber} />
    })

    useEffect(() => {
        setTempRecipe(editedRecipe)
    }, [editedRecipe])

    const addNewRecipeStepBlock = () => {
        let tempRecipeStepListAddition = tempRecipe.recipeStepList
        let block: RecipeStepBlock = {
            for: '',
            steps: [{recipeStepNumber: 1, recipeStepText: ''}],
            blockNumber: tempRecipe.recipeStepList.length + 1
        }
        tempRecipeStepListAddition.push(block)
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempRecipeStepListAddition
            }
        })
    }

    const addNewIngredientBlock = () => {
        let tempIngredientListAddition = tempRecipe.ingredientList
        let block: IngredientBlock = {
            for: '',
            ingredients: [{ingredientName: '', ingredientAmount: '', ingredientId: 1, ingredientUnit: ''}],
            blockNumber: tempRecipe.ingredientList.length + 1
        }
        tempIngredientListAddition.push(block)
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList: tempIngredientListAddition
            }
        })
    }

    const deleteLastRecipeStepBlock = () => {
        let tempRecipeStepListSubtraction = tempRecipe.recipeStepList
        tempRecipeStepListSubtraction.pop()
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempRecipeStepListSubtraction
            }
        })
    }

    const deleteLastIngredientBlock = () => {
        let tempIngredientListSubtraction = tempRecipe.ingredientList
        tempIngredientListSubtraction.pop()
        setTempRecipe(prev => {
            return {
                ...prev,
                ingredientList: tempIngredientListSubtraction
            }
        })
    }

    const uploadFinishedRecipe = async () => {
        if (
            tempRecipe.recipeName && 
            tempRecipe.ingredientList.length > 0 && 
            tempRecipe.recipeStepList.length > 0
            ) {
            await setDoc(doc(db, `${user?.email}`, 'recipeCollection', 'recipes', `${tempRecipe.docId}`), tempRecipe)
            alert('edits uploaded')
        } else {
            alert('recipes must have a name and at least one ingredient and step each, edit failed')
        }
    } 


  return (
    <>
        <div>
            {editedRecipe.recipeName}
            <button onClick={addNewRecipeStepBlock} >Add New Recipe Step Block</button>
            <button onClick={deleteLastRecipeStepBlock} >Delete Last Recipe Step Block</button>
            <button onClick={addNewIngredientBlock} >Add New Ingredient Block</button>
            <button onClick={deleteLastIngredientBlock} >Delete Last Ingredient Block</button>
        </div>
        <div className="recipe-container">
            <div className="ingredient-list">
                {listIngredientBlocks}
            </div>
            <div className="recipe-steps">
                {listRecipeStepBlocks}
            </div>
        </div>
        <CurrentRecipe currentRecipe={tempRecipe} />
        <button onClick={uploadFinishedRecipe}>Upload Finished Recipe</button>
    </>
  )
}

export default EditRecipe