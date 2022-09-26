import React from 'react'
import SignOutButton from '../components/UIComponents/SignOutButton'
import Link from 'next/link'
import RecipeInputComp from '../components/EditInputComponents/RecipeInputComp'
import { dummyRecipe } from '../pages/recipeList'
import { Card, Button } from '@mui/material'

const RecipeInput = () => {
  return (
    <> 
        <RecipeInputComp dummyRecipe={dummyRecipe}/>
        <Card style={{ width: 250, margin: 10, padding: 10}}>
            <Link href="/recipeList">
                <Button>To Recipe List</Button>
            </Link>
            <Link href="/social">
                <Button>To Social</Button>
            </Link>
            <SignOutButton />
        </Card>
    </> 
  )
}

export default RecipeInput