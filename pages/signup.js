import React, { useState } from "react";
import Link from "next/link";
import baseUrl from "../helpers/baseUrl";
import {useRouter} from "next/router";
const Signup = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const userSignup = async (e) =>{
       e.preventDefault()
       const res = await fetch(`${baseUrl}/api/signup`,{
         method:"POST",
         headers:{
           "Content-Type":"application/json"
          },
          body:JSON.stringify({
            name,
            email,
            password
          })
        })
        const res2 = await res.json()
        console.log(res2)
        if(res2.error){
          console.log(res2)
          setName("")
          setEmail("")
          setPassword("")
          M.toast({ html: res2.error, classes: "red" })
        }else{
          M.toast({ html:res2.message, classes: "green" })
          router.push("/signin")
        }
  }
  return (
    <div className="container card authcard center-align">
      <h3>Signup</h3>
      <form onSubmit={(e)=>userSignup(e)}>
        <input type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Signup
        <i className="material-icons right">forward</i>
        </button>
        <Link href="/signin"><a><h5>Already Have An Account?</h5></a></Link>
      </form>
    </div>
  )
}

export default Signup