import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import FriendRequest from "../components/FriendRequest";
import SignOutButton from "../components/UIComponents/SignOutButton";
import Link from "next/link";
import { Card, TextField, Typography, Button } from "@mui/material";
import { useState as useStateHookState } from "@hookstate/core";
import { store } from "../components/store";

const social = () => {
  const testState = useStateHookState(store);

  const router = useRouter();
  const { user } = useAuth();

  const [friendRequestInput, setFriendRequestInput] = useState("");
  const [listOfFriends, setListOfFriends] = useState<string[]>([]);
  const [listOfFriendRequests, setListOfFriendRequests] = useState<string[]>(
    []
  );

  const uploadFriendRequestUpdate = async (
    user: string,
    friendRequestArray: object
  ) => {
    await setDoc(
      doc(db, `${user}`, "social", "socialItems", "friendRequestArray"),
      friendRequestArray
    );
  };

  const uploadFriendListUpdate = async (
    user: string,
    friendListArray: object
  ) => {
    await setDoc(
      doc(db, `${user}`, "social", "socialItems", "friendListArray"),
      friendListArray
    );
  };

  const sendFriendRequest = async () => {
    const checkIfFriendExists = await getDocs(
      collection(db, friendRequestInput)
    );
    if (!checkIfFriendExists.empty) {
      const friendsRequestObject = await getDoc(
        doc(
          db,
          friendRequestInput,
          "social",
          "socialItems",
          "friendRequestArray"
        )
      );
      let friendRequestArray = friendsRequestObject.data()?.friendRequests;
      if (listOfFriends.includes(friendRequestInput)) {
        alert("friend request sent previously");
        return;
      } else {
        friendRequestArray.push(`${user?.email}`);
        const objectToUpload = {
          friendRequests: friendRequestArray,
        };
        uploadFriendRequestUpdate(friendRequestInput, objectToUpload);
        alert("friend request sent");
      }
    } else {
      alert("user does not exist");
    }
  };

  const acceptFriendRequest = async (friend: string) => {
    try {
      const friendsRequestObject = await getDoc(
        doc(db, `${user?.email}`, "social", "socialItems", "friendRequestArray")
      );
      let friendRequestArray: string[] = friendsRequestObject
        .data()
        ?.friendRequests.filter((request: string) => request !== friend);
      const friendsObject = await getDoc(
        doc(db, `${user?.email}`, "social", "socialItems", "friendListArray")
      );
      let friendsArray: string[] = friendsObject.data()?.friendList;
      friendsArray.push(friend);
      const friendsFriendListObject = await getDoc(
        doc(db, `${friend}`, "social", "socialItems", "friendListArray")
      );
      let friendsFriendListArray: string[] =
        friendsFriendListObject.data()?.friendList;
      friendsFriendListArray.push(user.email);
      setListOfFriends(friendsArray);
      setListOfFriendRequests(friendRequestArray);
      uploadFriendRequestUpdate(user?.email, {
        friendRequests: friendRequestArray,
      });
      uploadFriendListUpdate(friend, { friendList: friendsFriendListArray });
      uploadFriendListUpdate(user?.email, { friendList: friendsArray });
      alert("friend request accepted");
    } catch {
      alert("something went wrong");
    }
  };

  useEffect(() => {
    const getFriendList = async () => {
      const friendListObject = await getDoc(
        doc(db, user?.email, "social", "socialItems", "friendListArray")
      );
      const friendListArray = friendListObject.data()?.friendList;
      setListOfFriends(friendListArray);
    };
    getFriendList();
  }, []);

  useEffect(() => {
    const getFriendRequestList = async () => {
      const friendRequestRecievedObject = await getDoc(
        doc(db, user?.email, "social", "socialItems", "friendRequestArray")
      );
      const friendRequestRecievedArray =
        friendRequestRecievedObject.data()?.friendRequests;
      setListOfFriendRequests(friendRequestRecievedArray);
    };
    getFriendRequestList();
  }, []);

  const friendRequestList = listOfFriendRequests.map((request: string) => {
    return (
      <FriendRequest
        key={listOfFriendRequests.indexOf(request)}
        request={request}
        acceptFriendRequest={acceptFriendRequest}
      />
    );
  });

  const friendList = listOfFriends.map((friend) => {
    return (
      <Typography key={listOfFriends.indexOf(friend)}>{friend}</Typography>
    );
  });

  return (
    <>
      <Card style={{ width: 217, margin: 10, padding: 10 }}>
        <TextField
          placeholder="input a friends email"
          onChange={(e) => {
            setFriendRequestInput(e.target.value);
          }}
        ></TextField>
        <Button onClick={sendFriendRequest}>Send Friend Request</Button>
      </Card>
      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Typography>Friend Requests</Typography>
        {friendRequestList}
      </Card>
      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Typography>Friend List</Typography>
        {friendList}
      </Card>

      <Card style={{ width: 250, margin: 10, padding: 10 }}>
        <Link href="/recipeInput">
          <Button>To Recipe Input</Button>
        </Link>
        <Link href="/recipeList">
          <Button>To Recipe List</Button>
        </Link>
        <SignOutButton />
      </Card>
      <TextField
        onChange={(e) => {
          testState.currentRecipe.recipeName.set(e.target.value);
        }}
        value={testState.currentRecipe.recipeName.get()}
      />
    </>
  );
};

export default social;
