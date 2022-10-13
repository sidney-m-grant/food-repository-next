import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";

export default function SignIn() {
  const { user, signup, login, logout } = useAuth();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const router = useRouter();

  // registering a new user creates a collection in firestore with a docId equal to the sign up email
  // in that collection is a document social, which has a subcollection containing two arrays
  // one is an array of friend requests (strings with other users emails) and another of friends

  const registerNewUser = async () => {
    try {
      await signup(registerEmail, registerPassword);
      const socialCollection = {
        name: "social",
      };
      const recipeCollection = {
        name: "recipe",
      };
      const friendRequestArray = {
        friendRequests: [],
      };
      const friendListArray = {
        friendList: [],
      };
      await setDoc(doc(db, registerEmail, "social"), socialCollection);
      await setDoc(
        doc(db, registerEmail, "social", "socialItems", "friendRequestArray"),
        friendRequestArray
      );
      await setDoc(
        doc(db, registerEmail, "social", "socialItems", "friendListArray"),
        friendListArray
      );
      await setDoc(
        doc(db, registerEmail, "recipeCollection"),
        recipeCollection
      );
      router.push("/recipeList");
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    try {
      await login(loginEmail, loginPassword);
      console.log(user);
      router.push("/recipeList");
    } catch (error) {
      console.log(error);
    }
  };

  const alreadySignedIn = () => {
    if (user) {
      router.push("/recipeList");
    } else {
      console.log("not signed in");
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Card sx={{ maxWidth: 450 }}>
          <CardContent>
            {user?.email ? user.email : "not signed in"}
          </CardContent>
          <CardContent>
            <TextField
              variant="outlined"
              label="Email"
              value={registerEmail}
              onChange={(e) => {
                setRegisterEmail(e.target.value);
              }}
            ></TextField>
            <TextField
              variant="outlined"
              label="Password"
              value={registerPassword}
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
            ></TextField>
            <Button onClick={registerNewUser}>Register</Button>
          </CardContent>
          <CardContent>
            <TextField
              variant="outlined"
              label="Email"
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
              }}
            ></TextField>
            <TextField
              variant="outlined"
              label="Password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}
            ></TextField>
            <Button onClick={signIn}>Sign In</Button>
          </CardContent>
          <CardContent>
            <Button
              onClick={() => {
                logout();
              }}
            >
              Sign Out
            </Button>
            <Button onClick={alreadySignedIn}>Already Signed In</Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
