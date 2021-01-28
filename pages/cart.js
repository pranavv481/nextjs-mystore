import baseUrl from "../helpers/baseUrl";
import { parseCookies } from 'nookies'
import cookie from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
const Cart = ({ error, products }) => {
    const { token } = parseCookies()
    const router = useRouter()
    const [cProduct, setProduct] = useState(products)
   
     let price =0
    if (!token) {
        return (
            <div className="center-align">
                <h3>Please Login To View Your cart</h3>
                <Link href="/signin"><a><button className="btn #1565c0 blue darken-3">Login</button></a></Link>
            </div>
        )

    }

    if (error) {
        M.toast({ html: error, classes: "red" })
        cookie.remove('token')
        cookie.remove('user')
        router.push("/signin")
    }

    const handleRemove = async (id) => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                productId: id
            })
        })

        const res2 = await res.json()
        setProduct(res2)

    }

    const CartItems = () => {
        return (
            <>
                {cProduct.map(item => {
                    price = price + item.quantity*item.product.price
                   
                    return (
                        <div style={{ display: "flex", margin: "5%" }} key={item._id}>
                            <img src={item.product.mediaUrl} style={{ width: "30%", height: "200px" }} />
                            <div style={{ marginLeft: "10%" }}>
                                <h6>{item.product.name}</h6>
                                <h6>{item.quantity}*{item.product.price}</h6>
                                <button className="btn red" onClick={() => { handleRemove(item.product._id) }}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    const handleCheckout = async (paymentInfo) =>{
        console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json()
        console.log(res2)
        M.toast({html:res2.message, classes:"green"})
        router.push("/")
    }

    const TotalPrice = () => {
        return (
            <div className="container" style={{ display: "flex", justifyContent: "space-between", marginTop:"5%" }}>
                {products.length!=0 &&  <h5>Total {price}</h5> }
                {products.length!=0  && <StripeCheckout
                 name="My Store" // the pop-in header title
                 amount={price*100}
                 image={products.length>0?products[0].product.mediaUrl:""}
                 currency="INR"
                 shippingAddress={true}
                 billingAddress={true}
                 zipCode={true}
                 stripeKey="pk_test_51H4NclGVlmlKnZnYoOBRkDuuC6WjSSq8Nlzf8D4LNVAWgPvV0MEP3elODi66snu45ks9F0IAoumAiRp3exG5PhZ400dTmnM0hE"
                 token={(paymentInfo)=>handleCheckout(paymentInfo)}
                >
                    
                <button className="btn #1565c0 blue darken-3">Checkout</button>
                </StripeCheckout>}
                {products.length==0 && <h2>No Product Found</h2>}
                
            </div>
        )
    }

    return (
        <div className="container" >
           
            <CartItems />
            <TotalPrice />
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx)
    if (!token) {
        return {
            props: { products: [] },
        }
    }

    console.log(token)
    const res = await fetch(`${baseUrl}/api/cart`, {
        headers: {
            "Authorization": token
        }
    })
    const products = await res.json()
    if (products.error) {
        return {
            props: { error: products.error },
        }
    }
    console.log(products)
    return {
        props: { products }, // will be passed to the page component as props
    }
}

export default Cart