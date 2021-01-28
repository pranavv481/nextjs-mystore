import initDB from "../../helpers/initDB";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import Cart from "../../models/Cart";

initDB()

export default async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(422).json("Please fill all fields");
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(422).json({ error: "User Already Exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await new User({
            name,
            email,
            password: hashedPassword
        }).save()
        console.log(newUser)
        const cart = await new Cart({user:newUser._id}).save()
        console.log(cart)
    
        res.status(201).json({ message: "Signup Success" })
    } catch (err) {
        console.log(err)
    }
}
