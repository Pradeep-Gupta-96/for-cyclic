import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import path from 'path'
import { fileURLToPath } from 'url';
import { config } from "dotenv"
import { mydatabase } from "./db/connections.js"
import { User } from "./models/models.js"
import { router } from "./routs/auth.js"
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body-parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

config({
    path: "./config.env"
})

mydatabase()
User()

app.use(router)

const Middleware = (req, res, next) => {
    console.log("Middleware conneted")
    next()
}

// app.get("/", (req, res) => {
//     res.send("helllow world")
// }) 

app.get("/about", Middleware, (req, res) => {
    res.send("helllow world about")
})

// static File 
 app.use(express.static(path.join(__dirname, './client/build')))
 app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
 })

app.get("/contact", (req, res) => {
    res.send("helllow world contact")
})
app.get("/signin", (req, res) => {
    res.send("helllow world signin")
})
app.get("/signout", (req, res) => {
    res.send("helllow world signout")
})

app.listen(process.env.PORT, () => {
    console.log(`server running at port ${process.env.PORT}`)
})