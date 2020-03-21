import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.confing";
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    password: "",
    isValid: false,
    error: "",
    formToggle: false
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  // handleSignIn start method
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
      })
      .catch(error => {
        console.log(error);
        console.log(error.massage);
      });
  };
  // handleSignOut start method
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
          password: "",
          isValid: false,
          error: "",
          formToggle: false
        };
        setUser(signOutUser);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // email change Hendler method
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    // form validation
    //===============
    // email validation
    const is_valid_email = email => {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    // password validtion
    const hasNumber = input => /\d/.test(input);
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };

  // createAccount Handler method
  const createAccount = e => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    } else {
      console.log("from not validate");
    }
    e.preventDefault();
    e.target.reset();
  };

  const signInAccount = e => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const logInUser = { ...user };
          logInUser.isSignedIn = true;
          logInUser.error = "";
          setUser(logInUser);
        })
        .catch(err => {
          console.log(err.message);
          const logInUser = { ...user };
          logInUser.isSignedIn = false;
          logInUser.error = err.message;
          setUser(logInUser);
        });
    } else {
      console.log("from not validate");
    }
    e.preventDefault();
    e.target.reset();
  };

  const userFromToggle = e => {
    const userFromToggle = { ...user };
    userFromToggle.formToggle = e.target.checked;
    setUser(userFromToggle);
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}> signOut</button>
      ) : (
        <button onClick={handleSignIn}> signIn google account</button>
      )}

      {user.isSignedIn && (
        <div>
          <p> Welcome, {user.name}</p>
          <p> your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1> Create account Authentication</h1>
      {user.error && (
        <p style={{ color: "#fff", background: "red" }}>{user.error}</p>
      )}

      <input
        type="checkbox"
        name="fromToggle"
        id="fromToggle"
        onChange={userFromToggle}
      />
      <label htmlFor="fromToggle">you have login info</label>
      <hr />

      {/*  signInAccount form element start*/}

      <form
        onSubmit={signInAccount}
        style={{ display: user.formToggle ? "none" : "block" }}
      >
        <input
          onBlur={handleChange}
          type="text"
          name="email"
          placeholder="your email"
          required
        />
        <hr />
        <input
          onBlur={handleChange}
          type="password"
          name="password"
          placeholder="your password"
          required
        />
        <hr />
        <input type="submit" value="signIn Account" />
      </form>
      <br />

      {/* create account form element  start*/}
      <form
        onSubmit={createAccount}
        style={{ display: user.formToggle ? "block" : "none" }}
      >
        <input
          onBlur={handleChange}
          type="text"
          name="name"
          placeholder="your name"
          required
        />
        <hr />
        <input
          onBlur={handleChange}
          type="text"
          name="email"
          placeholder="your email"
          required
        />
        <hr />
        <input
          onBlur={handleChange}
          type="password"
          name="password"
          placeholder="your password"
          required
        />
        <hr />
        <input type="submit" value="Create Account" />
      </form>
    </div>
  );
}

export default App;
