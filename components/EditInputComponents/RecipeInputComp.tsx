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
import { ButtonGroup, Card, Grid, Button, TextField} from '@mui/material'

interface Props {
    dummyRecipe: Recipe
}

const RecipeInputComp: React.FC<Props> = ({ dummyRecipe }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(dummyRecipe)
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

    const uploadRecipe = async () => {
        if (tempRecipe.recipeName && tempRecipe.recipeStepList.length > 0 && tempRecipe.ingredientList.length > 0) {
            setUploading(true)
            if (confirm('Upload Recipe?')) {
                if (tempImageFile) {
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
                    await addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe).then(() => setUploading(false))  
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
            addDoc(collection(db, `${user?.email}`, 'recipeCollection', 'recipes'), tempRecipe).then(() => setUploading(false))
        }
    }, [tempRecipe.imgPath])

  return (
    <>
        <Card sx={{ margin: 5, padding: 5 }}>
            <TextField helperText="Recipe Name" value={tempRecipe.recipeName} onChange={(e) => {setTempRecipe(prev => {
                return {
                    ...prev,
                    recipeName: e.target.value
                }
            })}}></TextField>
            <ButtonGroup>
                <Button style={{ fontSize: 12 }} onClick={addNewRecipeStepBlock} >Add New Recipe Step Block</Button>
                <Button onClick={deleteLastRecipeStepBlock} >Delete Last Recipe Step Block</Button>
                <Button onClick={addNewIngredientBlock} >Add New Ingredient Block</Button>
                <Button onClick={deleteLastIngredientBlock} >Delete Last Ingredient Block</Button>
            </ButtonGroup>
                <Button onClick={uploadRecipe} >Upload Recipe</Button>
                <input type="file" onChange={handleImgPreview}></input>
                {tempImagePreview ? <img src={tempImagePreview} style={{height: 150, width: 150}}></img> : null}
                { uploading ? <h3>Uploading, please do not leave the page</h3> : null}
        </Card>
        <Card sx={{ margin: 5, padding: 5 }}>
            <Grid container spacing={0}>
                <Grid item xs={7}>
                    {listIngredientBlocks}
                </Grid>
                <Grid item xs={5}>
                    {listRecipeStepBlocks}
                </Grid>    
            </Grid>
        </Card>
        <CurrentRecipe currentRecipe={tempRecipe} />
    </>
  )
}

export default RecipeInputComp