import React, { useEffect, useState } from 'react'
import type { Recipe, RecipeStep } from '../pages/recipeList'

interface Props {
    setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    recipeStep: RecipeStep;
    recipe: Recipe;
}

const EditRecipeSub: React.FC<Props> = ({ setTempRecipe, recipeStep, recipe }) => {
    const [editedText, setEditedText] = useState<string>(recipeStep.recipeStepText)

    const handleClick = () => {
        let tempArray = recipe.recipeStepList;
        tempArray[recipeStep.recipeStepNumber-1].recipeStepText = editedText;
        setTempRecipe(prev => {
            return {
                ...prev,
                recipeStepList: tempArray
            }
        })
    }
    
    useEffect(() => {
        setEditedText(recipeStep.recipeStepText)
    }, [recipe])

  return (
    <div>
        <input onChange={(e) => {setEditedText(e.target.value)}} value={editedText} placeholder={recipeStep.recipeStepText}/>
        <button onClick={handleClick}>Save Edit</button>
    </div>
  )
}

export default EditRecipeSub