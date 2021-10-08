import React from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider,createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile } from "firebase/auth";
const app = initializeApp(firebaseConfig);



function App() {
const [newUser,setNewUser]=useState(false);

  const[user,setUser]= useState({
    isSignedIn: false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:''
  })
  console.log(user)
  // Google Sign IN
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  // Facebook Sign In





  const handleSignIn = ()=>{
    // console.log("sign in clikced")
    signInWithPopup(auth,provider)
    .then(res=>{
      const {displayName,photoURL,email}= res.user;
      const signedInUser = {
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser)
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }



  const handleSignOut=()=>{
      auth.signOut()
      .then(res=>{
          const signedOutUser = {
            newUser:false,
            isSignedIn:false,
            name:'',
            photo:'',
            email:'',
            error:'',
            success:false
          }
      setUser(signedOutUser);
      })
      .catch(err =>{

      })
  }





    const handleBlur = (event)=>{
    console.log(event.target.name,event.target.value);
    let isFieldValid = true;
    if(event.target.name === 'email'){
      
      // eslint-disable-next-line no-unused-vars
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      
    }

    if (event.target.name === 'password'){
        const isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber;
    }

    if(isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;
        setUser(newUserInfo);
    }

    }






const handleSubmit = (e)=>{
  console.log(user.email,user.password)
  if(newUser && user.email && user.password){
    createUserWithEmailAndPassword(auth,user.email, user.password)
    .then(res=>{
      console.log(res);
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success= true;
      setUser(newUserInfo);
      updateUserName(user.name);
      console.log(user.name)
      
    })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
    
    console.log(error,error.message);
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // console.log(errorCode,errorMessage)
    // ..
  });
  }
  if(!newUser && user.email && user.password){
    signInWithEmailAndPassword(auth,user.email, user.password)
  .then(res=>{
    const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success= true;
      setUser(newUserInfo);
      console.log('sign in user info',res.user)
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
  });
  }
  e.preventDefault();
}



const updateUserName = name =>{
  const user = auth.currentUser;

  updateProfile(auth.currentUser, {
    displayName: name
  }).then(() => {
    // Profile updated!
    console.log("user name updated Successfully")
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  }); 
  }

  return (
    <div className="App">
     {
       user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
       <button onClick={handleSignIn}>Google Sign In</button>

       }
       <h1>{user.email}</h1>
       <img src={user.photo} alt="" />
       <h2>{user.name}</h2>
       <br />

     <h1>Our OWN Authentication</h1>
     <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
     <label htmlFor="newUser">New User Sign up</label>
     <form onSubmit={handleSubmit}>
      
     { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
     <br/>
     <input type="email" onBlur={handleBlur} name="email" placeholder="Your Email" required/><br/>
     <input type="password" onBlur={handleBlur}  name="password" placeholder="Your Password" required/><br/>
     <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
     </form>

     <p style={{color:'red'}}>{user.error}</p>
     
     {user.success && <p style={{color:'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}

    </div>
  );
}

export default App;
