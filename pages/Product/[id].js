import { useRouter } from "next/router";
import baseUrl from "../../helpers/baseUrl";
import { useRef, useEffect, useState } from "react";
import { parseCookies } from 'nookies'
import cookie2 from "js-cookie";
const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter();
  const modalRef = useRef(null)
  const cookie = parseCookies()
  console.log(cookie)
  const user = cookie.user ? JSON.parse(cookie.user) : ""
  console.log(user)

  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, [])



  if (router.fallback) {
    return (
      <h3>Loading..</h3>
    )
  }

  const getModal = () => {
    console.log(product._id)
    return (
      <div id="modal1" className="modal" ref={modalRef}>
        <div className="modal-content">
          <h4>{product.name}</h4>
          <p>Are you sure want to delete this ?</p>
        </div>
        <div className="modal-footer">
          <button className="btn waves-effect waves-light #1565c0 blue darken-3">Cancel</button>
          <button className="btn waves-effect waves-light #c62828 red darken-3" onClick={() => deleteProduct()}>Yes</button>

        </div>
      </div>
    )
  }

  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: "DELETE"
    })
    await res.json()
    router.push("/")
  }

  const addToCart = async () => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": cookie.token
      },
      body: JSON.stringify({
        quantity,
        productId: product._id
      })
    })
    const res2 = await res.json()
    if (res2.error) {
      M.toast({ html: error, classes: "red" })
      cookie2.remove("user")
      cookie2.remove("token")
      router.push('/login')
    }
    M.toast({ html: res2.message, classes: "green" })

  }

  const redirectToSignin = () => {
    console.log("checkkkkk")
    router.push("/signin");
  }
  return (
    <div className="container center-align">
      <h3>{product.name}</h3>
      <img src={product.mediaUrl} style={{ width: "30%" }} />
      <h5>Rs.{product.price}</h5>
      <input type="number"
        placeholder="Quantity"
        min="1"
        style={{ width: "50%", margin: "10px" }}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      {user ?
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => { addToCart() }}>Add
      <i className="material-icons right">add</i>
        </button>
        :
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => { redirectToSignin() }}>Login To Add
      <i className="material-icons right" >add</i>
        </button>
      }

      <p className="left-align">{product.description}</p>
      {user.role == 'admin' || user.role == 'root' &&
        <button data-target="modal1" className="btn modal-trigger waves-effect waves-light #c62828 red darken-3">Delete
      <i className="material-icons left">delete</i>
        </button>
      }
      {getModal()}
    </div>
  )
}




export async function getStaticProps({ params: { id } }) {
  const res = await fetch(`${baseUrl}/api/product/${id}`)
  const data = await res.json()
  return {
    props: {
      product: data
    }, // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: "600cff6d2c261d11abc38273" } } // See the "paths" section below
    ],
    fallback: true // See the "fallback" section below
  };
}

export default Product  