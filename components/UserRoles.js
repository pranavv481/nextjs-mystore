import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import baseUrl from "../helpers/baseUrl";

function userRoles() {
    const [users, setUsers] = useState([]);
    const { token } = parseCookies()
    useEffect(() => {
        fetchUser()
    }, [])
    const fetchUser = async () => {
        const res = await fetch(`${baseUrl}/api/users`, {
            headers: {
                "Authorization": token
            }
        })
        const res2 = await res.json()
        console.log(res2)
        setUsers(res2)
    }

    const handleRole = async (_id, role) =>{
        const res = await fetch(`${baseUrl}/api/users`, {
            method:"PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization": token
            },
            body:JSON.stringify({
                _id,
                role
            })
        })
        const res2 = await res.json()
        console.log(res2)
        // setUsers(res2)
       const updatedUser = users.map(data=>{
            if((data.role!= res2.role) && (data._id == res2._id) ){
                return res2
            }else{
               return data
            }
        })
        setUsers(updatedUser)
    } 
    return (
        <>
        <h1>User Roles</h1>
        <table className="striped">
        <thead>
          <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
          </tr>
        </thead>

        <tbody>
            {users.map(data=>(
              
                <tr key={data._id}>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td onClick={()=>{handleRole(data._id,data.role)}}>{data.role}</td>
              </tr>
            ))}
         
         
        </tbody>
      </table>
        </>
    )
}

export default userRoles