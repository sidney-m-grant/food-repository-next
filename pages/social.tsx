import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import FriendRequest from '../components/FriendRequest'
import SignOutButton from '../components/SignOutButton'
import Link from 'next/link'


const social = () => {

    const router = useRouter()
    const { user } = useAuth()

    const [friendRequestInput, setFriendRequestInput] = useState("")
    const [listOfFriends, setListOfFriends] = useState<string[]>([])
    const [listOfFriendRequests, setListOfFriendRequests] = useState<string[]>([])

    const uploadFriendRequestUpdate = async ( user:string, friendRequestArray: object ) => {
        await setDoc(doc(db, `${user}`, "social", "socialItems", "friendRequestArray"), friendRequestArray)
    }

    const uploadFriendListUpdate = async ( user: string, friendListArray: object ) => {
      await setDoc(doc(db, `${user}`, "social", "socialItems", "friendListArray"), friendListArray)
    }

    const sendFriendRequest = async () => {
        const checkIfFriendExists = await getDocs(collection(db, friendRequestInput))
        if (!checkIfFriendExists.empty) {
            const friendsRequestObject = await getDoc(doc(db, friendRequestInput, "social", "socialItems", "friendRequestArray"))
            let friendRequestArray = friendsRequestObject.data()?.friendRequests;
            if (listOfFriends.includes(friendRequestInput)) {
                alert('friend request sent previously')
                return
            } else {
                friendRequestArray.push(`${user?.email}`)
                const objectToUpload = {
                    friendRequests: friendRequestArray
                }
                uploadFriendRequestUpdate(friendRequestInput, objectToUpload)
                alert('friend request sent')
            }
        } else {
            alert('user does not exist')
        }
    }

    const acceptFriendRequest = async ( friend:string ) => {
      try {
          const friendsRequestObject = await getDoc(doc(db, `${user?.email}`, "social", "socialItems", "friendRequestArray"))
          let friendRequestArray: string[] = friendsRequestObject.data()?.friendRequests.filter((request: string) => request !== friend)
          const friendsObject = await getDoc(doc(db, `${user?.email}`, "social", "socialItems", "friendListArray"))
          let friendsArray: string[] = friendsObject.data()?.friendList
          friendsArray.push(friend)
          const friendsFriendListObject = await getDoc(doc(db, `${friend}`, "social", "socialItems", "friendListArray"))
          let friendsFriendListArray: string[] = friendsFriendListObject.data()?.friendList
          friendsFriendListArray.push(user.email) 
          setListOfFriends(friendsArray)
          setListOfFriendRequests(friendRequestArray)
          uploadFriendRequestUpdate(user?.email, {friendRequests: friendRequestArray})
          uploadFriendListUpdate(friend, {friendList: friendsFriendListArray})
          uploadFriendListUpdate(user?.email, {friendList: friendsArray})
          alert('friend request accepted')
      } catch {
        alert('something went wrong')
      }
    }

    useEffect(() => {
      const getFriendList = async () => {
        const friendListObject = await getDoc(doc(db, user?.email, "social", "socialItems", "friendListArray"))
        const friendListArray = friendListObject.data()?.friendList
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
    
    const friendRequestList = listOfFriendRequests.map((request: string) => {
      return <FriendRequest key={listOfFriendRequests.indexOf(request)} request={request} acceptFriendRequest={acceptFriendRequest}/>
    }) 

    const friendList = listOfFriends.map((friend) => {
      return <h5 key={listOfFriends.indexOf(friend)}>{friend}</h5>
  })

  return (
    <>
        <div style={{ margin: 10, padding: 10 }}>
            <input placeholder="input a friends email" onChange={(e) => {setFriendRequestInput(e.target.value)}}></input>
            <button onClick={sendFriendRequest}>Send Friend Request</button>
        </div>

        <div className="social-list">
          <h5>Friend Requests</h5>
           {friendRequestList}
        </div>
        <div className="social-list">
          <h5>Friend List</h5>
          {friendList}
        </div>
        
        <div style={{ margin: 10, padding: 10 }}>
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

export default social