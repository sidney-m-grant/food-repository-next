import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'


const social = () => {

    const router = useRouter()
    const { user } = useAuth()

    const [friendRequestInput, setFriendRequestInput] = useState("")
    const [listOfFriends, setListOfFriends] = useState<string[]>([])
    const [listOfFriendRequests, setListOfFriendRequests] = useState<string[]>([])

    const uploadFriendRequestUpdate = async ( friendRequestArray: object ) => {
        await setDoc(doc(db, friendRequestInput, "social", "socialItems", "friendRequestArray"), friendRequestArray)
    }

    const sendFriendRequest = async () => {
        const friendsRequestObject = await getDoc(doc(db, friendRequestInput, "social", "socialItems", "friendRequestArray"))
        let friendRequestArray = friendsRequestObject.data()?.friendRequests;
        if (listOfFriends.includes(friendRequestInput)) {
            return
        } else {
            friendRequestArray.push(`${user?.email}`)
            const objectToUpload = {
                friendRequests: friendRequestArray
            }
            uploadFriendRequestUpdate(objectToUpload)
        }
    }

    useEffect(() => {
      const getFriendList = async () => {
        const friendListObject = await getDoc(doc(db, user?.email, "social", "socialItems", "friendList"))
        const friendListArray = friendListObject.data()?.friendRequests
        setListOfFriends(friendListArray)
      }
      getFriendList()
    }, [])

    useEffect(() => {
        const getFriendRequestList = async () => {
          const friendRequestRecievedObject = await getDoc(doc(db, user?.email, "social", "socialItems", "friendRequestArray"))
          const friendRequestRecievedArray = friendRequestRecievedObject.data()?.friendRequests
          setListOfFriendRequests(friendRequestRecievedArray)
        }
        getFriendRequestList()
      }, [])
    
    const friendRequestList = listOfFriendRequests.map((request) => {
        return <h5 key={listOfFriendRequests.indexOf(request)}>{request}</h5>
    })

  return (
    <>
        <div>
            <input placeholder="input a friends email" onChange={(e) => {setFriendRequestInput(e.target.value)}}></input>
            <button onClick={sendFriendRequest}>Send Friend Request</button>
            <button onClick={() => router.push('/recipeInput')}>To Recipe Input</button>
            <button onClick={() => router.push('/recipeList')}>To Recipe List</button>
        </div>
        {friendRequestList}
    </>
  )
}

export default social