import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStepBlock, IngredientBlock } from '../../pages/recipeList'
import CurrentRecipe from '../RecipeComponents/CurrentRecipe'
import { addDoc, collection, } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { db, storage } from '../../firebase'
import EditRecipeSubBlock from './EditRecipeSubBlock'
import EditIngredientSubBlock from './EditIngredientSubBlock'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import Compressor from 'compressorjs'

interface Props {
    dummyRecipe: Recipe
}

const RecipeInputComp: React.FC<Props> = ({ dummyRecipe }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(dummyRecipe)
    const [tempRecipeName, setTempRecipeName] = useState<string>('')
    const [tempImageFile, setTempImageFile] = useState<File | null>(null)
    const [tempImagePreview, setTempImagePreview] = useState('')
    const [uploading, setUploading] = useState<boolean>(false)

    const listRecipeStepBlocks = tempRecipe.recipeStepList.map((recipeStepBlock) => {
        return <EditRecipeSubBlock setTempRecipe={setTempRecipe} recipeStepBlock={recipeStepBlock} tempRecipe={tempRecipe} key={recipeStepBlock.blockNumber} />
    })

    const listIngredientBlocks = tempRecipe.ingredientList.map((ingredientBlock) => {
        return <EditIngredientSubBlock setTempRecipe={setTempRecipe} ingredientBlock={ingredientBlock} tempRecipe={tempRecipe} key={ingredientBlock.blockNumber} />
    })

    const addNewRecipeStepBlock = () => {
        let tempRecipeStepListAddition = tempRecipe.recipeStepList
        let block: RecipeStepBlock = {
            for: '',
            steps: [{recipeStepNumber: 1, recipeStepText: ''}],
            blockNumber: tempRecipe.recipeStepList.length
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
            blockNumber: tempRecipe.ingredientList.length
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
                if (tempImageFile) {
                    setUploading(true)
                    const imageRef = ref(storage, `${user?.email}/${tempImageFile.name + v4()}`)
                    new Compressor(tempImageFile, {
                        quality: 0.2,
                        success(result) {
                            uploadBytes(imageRef, result)
                            .then((snapshot) => getDownloadURL(snapshot.ref))
                            .then((url) => setTempRecipe(prev => {
                                return {
                                    ...prev,
                                    imgPath: url
                                }
                            }))
                        }
                    })
                    
                } else {
                    await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
                }
            }
        }
    }
    
    const handleImgPreview = (e: any) => {
        setTempImageFile(e.target.files[0])
        setTempImagePreview(URL.createObjectURL(e.target.files[0]))
    }

    useEffect(() => {
        if (uploading) {
            addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe)
            setUploading(false)
        }
    }, [tempRecipe.imgPath])

{/*onChange={(e) => {setTempRecipeName(e.target.value)}} onBlur={handleBlur} value={tempRecipeName} */} 

  return (
    <>
        <div>
            <input value={tempRecipe.recipeName} onChange={(e) => {setTempRecipe(prev => {
                return {
                    ...prev,
                    recipeName: e.target.value
                }
            })}}></input>
            {tempRecipeName}
            <button onClick={addNewRecipeStepBlock} >Add New Recipe Step Block</button>
            <button onClick={deleteLastRecipeStepBlock} >Delete Last Recipe Step Block</button>
            <button onClick={addNewIngredientBlock} >Add New Ingredient Block</button>
            <button onClick={deleteLastIngredientBlock} >Delete Last Ingredient Block</button>
            <input type="file" onChange={handleImgPreview}></input>
            {tempImagePreview ? <img src={tempImagePreview} style={{height: 150, width: 150}}></img> : null}
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