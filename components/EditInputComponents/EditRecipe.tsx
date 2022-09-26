import React, { useState, useEffect } from 'react'
import type { Recipe, RecipeStepBlock, IngredientBlock } from '../../pages/recipeList'
import CurrentRecipe from '../RecipeComponents/CurrentRecipe'
import { setDoc, doc } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage, db } from '../../firebase'
import EditRecipeSubBlock from './EditRecipeSubBlock'
import EditIngredientSubBlock from './EditIngredientSubBlock'
import { v4 } from 'uuid'
import Compressor from 'compressorjs'
import { ButtonGroup, Card, Grid, Button, TextField} from '@mui/material'


interface Props {
  editedRecipe: Recipe;
  toggleFetchRecipes: boolean;
  setToggleFetchRecipes: React.Dispatch<React.SetStateAction<boolean>>
}

const EditRecipe: React.FC<Props> = ({ editedRecipe, setToggleFetchRecipes, toggleFetchRecipes }) => {

    const { user } = useAuth()

    const [tempRecipe, setTempRecipe] = useState<Recipe>(editedRecipe)
    const [tempImageFile, setTempImageFile] = useState<File | null>(null)
    const [tempImagePreview, setTempImagePreview] = useState('')
    const [uploading, setUploading] = useState<boolean>(false)

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

    const deleteImage = async ( imgPath: string ) => {
        const deleteRef = ref(storage, imgPath)
        await deleteObject(deleteRef)
    }

    const uploadFinishedRecipe = async () => {
        if (
            tempRecipe.recipeName && 
            tempRecipe.ingredientList.length > 0 && 
            tempRecipe.recipeStepList.length > 0
            ) {
            setUploading(true)
            if (tempImageFile) {
                if (editedRecipe.imgPath) {
                    deleteImage(editedRecipe.imgPath)
                }
                const imageRef = ref(storage, `${user?.email}/${tempImageFile.name + v4()}`)
                new Compressor(tempImageFile, {
                    quality: 0.4,
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
                setDoc(doc(db, `${user?.email}`, 'recipeCollection', 'recipes', `${tempRecipe.docId}`), tempRecipe).then(() => setUploading(false))
            }
        } else {
            alert('recipes must have a name and at least one ingredient and step each, edit failed')
        }
    } 

    useEffect(() => {
        if (uploading) {
            setDoc(doc(db, `${user?.email}`, 'recipeCollection', 'recipes', `${tempRecipe.docId}`), tempRecipe).then(() => setToggleFetchRecipes(!toggleFetchRecipes))
            setUploading(false)
        }
    }, [tempRecipe.imgPath])

    const handleImgPreview = (e: any) => {
        if (e.target.files[0]) {
            setTempImageFile(e.target.files[0])
            setTempImagePreview(URL.createObjectURL(e.target.files[0]))
        } else {
            setTempImageFile(null)
            setTempImagePreview('')
        }
    }

  return (
    <>
        <Card>
            {editedRecipe.recipeName}
            <ButtonGroup>
                <Button style={{ fontSize: 12 }} onClick={addNewRecipeStepBlock} >Add New Recipe Step Block</Button>
                <Button onClick={deleteLastRecipeStepBlock} >Delete Last Recipe Step Block</Button>
                <Button onClick={addNewIngredientBlock} >Add New Ingredient Block</Button>
                <Button onClick={deleteLastIngredientBlock} >Delete Last Ingredient Block</Button>
            </ButtonGroup> <br />
            <Button onClick={uploadFinishedRecipe} >Upload Recipe</Button>
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

export default EditRecipe