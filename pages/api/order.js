import initDB from "../../helpers/initDB";
import Order from "../../models/Orders";
import Authenticated from "../../helpers/Authenticated";

initDB()

export default Authenticated(async (req, res)=>{
   const orders = await Order.find({user:req.userId}).populate("products.product")
   console.log(orders)
   res.status(200).json(orders)
})