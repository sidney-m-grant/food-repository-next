import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStepBlock, IngredientBlock } from '../pages/recipeList'
import CurrentRecipe from './CurrentRecipe'
import { addDoc, collection, } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import EditRecipeSubBlock from './EditRecipeSubBlock'
import EditIngredientSubBlock from './EditIngredientSubBlock'

interface Props {
    dummyRecipe: Recipe
}

const RecipeInputComp: React.FC<Props> = ({ dummyRecipe }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(dummyRecipe)
    const [tempRecipeName, setTempRecipeName] = useState<string>('')

    const listRecipeStepBlocks = tempRecipe.recipeStepList.map((recipeStepBlock) => {
        return <EditRecipeSubBlock setTempRecipe={setTempRecipe} recipeStepBlock={recipeStepBlock} tempRecipe={tempRecipe} key={tempRecipe.recipeStepList.indexOf(recipeStepBlock)} />
    })

    const listIngredientBlocks = tempRecipe.ingredientList.map((ingredientBlock) => {
        return <EditIngredientSubBlock setTempRecipe={setTempRecipe} ingredientBlock={ingredientBlock} tempRecipe={tempRecipe} key={tempRecipe.ingredientList.indexOf(ingredientBlock)} />
    })

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

    const handleBlur = () => {
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeName: tempRecipeName
            }
        })
    }

    const uploadRecipe = async () => {
        if (tempRecipe.recipeName && tempRecipe.recipeStepList.length > 0 && tempRecipe.ingredientList.length > 0) {
            if (confirm('Upload Recipe?')) {
                await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
            }
        }
    }

  return (
    <>
        <div>
            <input onChange={(e) => {setTempRecipeName(e.target.value)}} onBlur={handleBlur} value={tempRecipeName}></input>
            {tempRecipeName}
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
        <button onClick={uploadRecipe} >Upload Recipe</button>
    </>
  )
}

export default RecipeInputComp