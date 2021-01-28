import Link from "next/link";
import baseUrl from "../helpers/baseUrl";

const Home = ({ products }) => {
  console.log(products)
  const productList = products.map(data => (

    <div className="card pcard" key={data._id}>
      <div className="card-image">
        <img src={data.mediaUrl} />
        <span className="card-title">{data.name}</span>
      </div>
      <div className="card-content">
        <p>{data.price}</p>
      </div>
      <div className="card-action">
        <Link href={'/Product/[id]'} as={`/Product/${data._id}`}><a>View Product</a></Link>
      </div>
    </div>
  ))
  return (
    <div className="rootcard">
      {productList}
    </div>
  )
}


export async function getStaticProps() {
  const res = await fetch(`${baseUrl}/api/products`)
  const data = await res.json()
  return {
    props: {
      products: data
    },
  }
}



export default Home