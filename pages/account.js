import { parseCookies } from 'nookies'
import baseUrl from "../helpers/baseUrl";
import { useEffect, useRef } from "react";
import UserRoles from "../components/UserRoles";

const Account = ({ orders }) => {
    const orderCard = useRef(null);
    const cookie = parseCookies();
    const user = cookie.user ? JSON.parse(cookie.user) : ""
   
    useEffect(() => {
        M.Collapsible.init(orderCard.current);
    }, [])

    const OrderHistory = () => {
        return (
            <ul className="collapsible" ref={orderCard}>
                {orders.map(item => (

                    <li key={item._id}>
                        <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                        <div className="collapsible-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Item Price</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {item.products.map(data => (
                                        <tr key={data.product._id}>
                                            <td>{data.product.name}</td>
                                            <td>{data.quantity}</td>
                                            <td>{data.product.price}</td>
                                            <td><img src={data.product.mediaUrl} style={{ width: "100px", height: "100px" }} /></td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </li>
                ))}


            </ul>
        )
    }
    return (
        <div className="container">
            <div className="center-align">
                <h4>{user.name}</h4>
                <h4>{user.email}</h4>
            </div>
            {orders.length == 0 ?
                <div className="container center-align">
                    <h4>You Have No Order History</h4>
                </div>
                :
                <>
                    <h3 className="center-align" style={{ textDecoration: "underline" }}>Order History</h3>
                    <OrderHistory />
                </>
            }
           {user.role=="root" && <UserRoles/>} 
           
        </div>
    )
}



export async function getServerSideProps(ctx) {
    // Parse
    const { token } = parseCookies(ctx)
    if (!token) {
        const { res } = ctx;
        res.writeHead(302, { Location: "/signin" })
        res.end()
    }

    const res = await fetch(`${baseUrl}/api/order`, {
        headers: {
            "Authorization": token
        }
    })
    const res2 = await res.json();
    console.log(res2)

    return {
        props: { orders: res2 }
    }


}



export default Account