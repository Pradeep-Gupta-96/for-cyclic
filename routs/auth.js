import express from "express"
import bcrypte from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/models.js";
export const router = express.Router();

router.get("/", (req, res) => {
    res.send("Wait wait i'm here")
})

// registration route 

// bellow code is bassed on promisses 
// router.post("/register", (req, res) => {
//     const { name, email, phone, password, cpassword } = req.body
//     if (!name || !email || !phone || !password || !cpassword) {
//         return res
//             .status(422)
//             .json({ error: "Might be you skip some details" })
//     }
//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res
//                     .status(422)
//                     .json({ error: "User already exist! please Use another email" })
//             }
//             const user = new User({ name, email, phone, password, cpassword })
//             user.save().then(() => {
//                 res.status(201)
//                     .json({ massage: "Successfully registerd!!" })
//             }).catch((error) => {
//                 res.status(500)
//                     .json({ error: "Faild to registered" })
//             })
//         }).catch(err => { console.err(); })
// })


// this code on the use of asyac-await
router.post("/register", async (req, res) => {
    const { name, email, phone, password, cpassword } = req.body
    if (!name || !email || !phone || !password || !cpassword) {
        return res
            .status(422)
            .json({ error: "Might be you skip some details" })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res
                .status(422)
                .json({ error: "User already exist! please Use another email" })
        } else if (password != cpassword) {
            return res
                .status(422)
                .json({ error: "Password didn't match" })
        } else {
            const user = new User({ name, email, phone, password, cpassword })
            await user.save()
            res.status(201)
                .json({ massage: "Successfully registerd!!" })
        }
    } catch (error) {
        console.log(error)
    }
})


// login route 
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "please fill your details" })
        }
        const userLogin = await User.findOne({ email: email })
        if (userLogin) {
            const isMatch = await bcrypte.compare(password, userLogin.password)
            const token = await userLogin.generateAuthToken()

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + process.env.JW_TOKEN * 60 * 1000),
                httpOnly: true,
            })
            if (isMatch) {
                return res
                    .status(201)
                    .json({ massage: "yeeah! Signin Successfully" })
            } else {
                return res
                    .status(412)
                    .json({ error: "oops! invalid credentials" })
            }
        } else {
            return res
                .status(412)
                .json({ error: "oops! invalid credentials" })
        }

    } catch (error) {
        console.log(error)
    }
})

// contact route 
router.post('/contact', async (req, res) => {
    const { name, email, subject, massage } = req.body
    try {
        if (!name || !email || !subject || !massage) {
            return res
                .status(400)
                .json({ message: "Oops! might be skip some option" })
        }
        const isM = await User.findOne({ email: email })

        if (isM) {
            const addMa = await isM.addMassage({ name, email, subject, massage })
        
            return res
                .status(201)
                .json({ massage: "feedback posted successfully" })
        } else {
            return res
                .status(400)
                .json({ message: "you had not register yet" })
        }
    } catch (error) {
        console.log(error)
    }

})