import Product from "../../../models/product";
import initDB from "../../../helpers/initDB";
initDB()
export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getProduct(req, res)
            break;
        case "DELETE":
            await deleteProduct(req, res)
            break;    
    }

}

const getProduct = async (req, res) => {
    try{
        const { pid } = req.query
        const product = await Product.findOne({ _id: pid })
        res.status(200).json(product)
    }catch(err){
        console.log(err)
    }
    
}

const deleteProduct = async (req, res) => {
    try{
        const { pid } = req.query
        await Product.findOneAndDelete({ _id: pid })
        res.status(200).json({})
    }catch(err){
        console.log(err)
    }
    
}



