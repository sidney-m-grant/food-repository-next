import React, { useEffect, useState } from 'react'
import type { Recipe, RecipeStep } from '../pages/recipeList'

interface Props {
    setTempRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
    recipeStep: RecipeStep;
    recipe: Recipe;
}

const EditRecipeSub: React.FC<Props> = ({ setTempRecipe, recipeStep, recipe }) => {
    const [editedText, setEditedText] = useState<string>(recipeStep.recipeStepText)

    const handleBlur = () => {
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
        <input onChange={(e) => {setEditedText(e.target.value)}} onBlur={handleBlur} value={editedText} placeholder={recipeStep.recipeStepText}/>
    </div>
  )
}

export default EditRecipeSub