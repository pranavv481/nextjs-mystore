import React, { useState } from "react";
import Link from "next/link";
import baseUrl from "../helpers/baseUrl";
import {useRouter} from "next/router";
import cookie from "js-cookie";

const Signin = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const userLogin = async(e) =>{
     e.preventDefault()
   const res = await fetch(`${baseUrl}/api/signin`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    
    const res2 = await res.json()
    console.log(res2)
    if(res2.error){
      M.toast({ html: res2.error, classes: "red" })
    }else{
      console.log(res2)
      cookie.set('token',res2.token)
      cookie.set('user',res2.user)
      M.toast({ html:"Successfully Login", classes: "green" })
      router.push("/account")
    }
  }
  return (
    <div className="container card authcard center-align">
      <h3>Signin</h3>
      <form onSubmit={(e)=>userLogin(e)}>
        <input type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Signin
        <i className="material-icons right">forward</i>
        </button>
        <Link href="/signup"><a><h5>Created An Account?</h5></a></Link>
      </form>
    </div>
  )
}

export default Signin