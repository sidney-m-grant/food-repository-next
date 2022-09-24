import React from 'react'
import SignOutButton from '../components/UIComponents/SignOutButton'
import Link from 'next/link'
import RecipeInputComp from '../components/EditInputComponents/RecipeInputComp'
import { dummyRecipe } from '../pages/recipeList'

const RecipeInput = () => {

/*
    const [tempRecipeStep, setTempRecipeStep] = useState<string>("")
    const [tempRecipeStepArray, setTempRecipeStepArray] = useState<RecipeStep[]>([])
    const [tempRecipeBlockArray, setTempRecipeBlockArray] = useState<RecipeStepBlock[]>([])
    const [tempRecipeBlockForStatement, setTempRecipeBlockForStatement] = useState<string>('')

    const [tempIngredientName, setTempIngredientName] = useState<string>("")
    const [tempIngredientAmount, setTempIngredientAmount] = useState<string>("")
    const [tempIngredientUnit, setTempIngredientUnit] = useState<string>("")
    const [tempIngredientArray, setTempIngredientArray] = useState<Ingredient[]>([])
    const [tempIngredientBlockArray, setTempIngredientBlockArray] = useState<IngredientBlock[]>([])
    const [tempIngredientBlockForStatement, setTempIngredientBlockForStatement] = useState<string>('')

    const [tempRecipeName, setTempRecipeName] = useState<string>("")

    const [tempRecipe, setTempRecipe] = useState<Recipe | null>(null)

    const uploadFinishedRecipe = async () => {
        if (tempRecipe){
            await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
        }
    } 

    const handleAddRecipeStepBlock = () => {
        if (tempRecipeStepArray.length >= 1) {
            const tempBlockToAdd: RecipeStepBlock = {
                for: tempRecipeBlockForStatement,
                steps: tempRecipeStepArray,
                blockNumber: tempRecipeBlockArray.length+1
            }
            setTempRecipeBlockArray(prev => [...prev, tempBlockToAdd])
            setTempRecipeStepArray([])
            setTempRecipeBlockForStatement('')
        }
    }

    const handleAddIngredientBlock = () => {
        if (tempIngredientBlockForStatement && tempIngredientArray.length >= 1) {
            const tempBlockToAdd: IngredientBlock = {
                for: tempIngredientBlockForStatement,
                ingredients: tempIngredientArray,
                blockNumber: tempIngredientBlockArray.length+1
            }
            setTempIngredientBlockArray(prev => [...prev, tempBlockToAdd])
            setTempIngredientArray([])
            setTempIngredientBlockForStatement('')
        }
    }

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

    const handleRemoveLastTempRecipeStep = () => {
        setTempRecipeStepArray((tempArray) => (tempArray.slice(0, -1)))
    }

    const handleRemoveLastTempIngredient = () => {
        setTempIngredientArray((tempArray) => (tempArray.slice(0, -1)))
    }

    const recipeStepListItems = tempRecipeBlockArray.map(block => {
        return <RecipeStepBlockComp key={tempRecipeBlockArray.indexOf(block)} stepBlock={block} recipeStepList={tempRecipeBlockArray}/>
    })

    const ingredientListItems = tempIngredientBlockArray.map(block => {
        return <IngredientBlockComp key={tempIngredientBlockArray.indexOf(block)} ingBlock={block} ingredientList={tempIngredientBlockArray}/>
    })

    const recipeStepsForCurrentBlock = tempRecipeStepArray.map(step => {
        return <h5 key={step.recipeStepNumber}>{step.recipeStepNumber} {step.recipeStepText}</h5>
    })

    const ingredientsForCurrentBlock = tempIngredientArray.map(ingredient => {
        return <h5 key={ingredient.ingredientId}>* {ingredient.ingredientAmount} {ingredient.ingredientUnit} {ingredient.ingredientName}</h5>
    })

    const uploadRecipe = () => {
        handleAddRecipeStepBlock()
        handleAddIngredientBlock()
        if (tempRecipeName) {
            const newRecipe: Recipe = {
                recipeName: tempRecipeName,
                recipeStepList: tempRecipeBlockArray,
                ingredientList: tempIngredientBlockArray,
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
*/

  return (
    
    <> 
        <RecipeInputComp dummyRecipe={dummyRecipe}/>
    {/*
        <div className="recipe-step-input-container">
            <textarea className="recipe-step-input" placeholder="Recipe Text" onChange={(e) => setTempRecipeStep(e.target.value)} value={tempRecipeStep} ></textarea>
            <button onClick={handleAddTempRecipeStep}>Add Recipe Step</button>
            <input placeholder="Recipe Step Block For..." onChange={(e) => setTempRecipeBlockForStatement(e.target.value)} value={tempRecipeBlockForStatement} ></input>
            <button onClick={handleAddRecipeStepBlock}>Add Recipe Block</button>
            {recipeStepsForCurrentBlock}
        </div>
        <div style={{ padding: 10, margin: 10 }}>
            <input placeholder="Ingredient Name" onChange={(e) => setTempIngredientName(e.target.value)} value={tempIngredientName} ></input>
            <input placeholder="Ingredient Amount" onChange={(e) => setTempIngredientAmount(e.target.value)} value={tempIngredientAmount}></input>
            <input placeholder="Ingredient Unit" onChange={(e) => setTempIngredientUnit(e.target.value)} value={tempIngredientUnit}></input>
            <button onClick={handleAddTempIngredient}>Add Ingredient</button>
            <input placeholder="Ingredient Block For..." onChange={(e) => setTempIngredientBlockForStatement(e.target.value)} value={tempIngredientBlockForStatement} ></input>
            <button onClick={handleAddIngredientBlock}>Add Ingredient Block</button>
            {ingredientsForCurrentBlock}
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
        */}
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