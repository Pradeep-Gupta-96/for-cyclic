import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    massages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            subject: {
                type: Number,
                required: true
            },
            massage: {
                type: String,
                required: true
            },
        }
    ],
    tokans: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// hashing the password 
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12)
            this.cpassword = await bcrypt.hash(this.cpassword, 12)
        }
    } catch (error) {
        console.log(error)
    }
    next();
})

// generating tokens
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRATE_KEY)
        this.tokans = this.tokans.concat({ token: token })
        await this.save()
        return token;
    } catch (error) {
        console.log(error)
    } 
}

//  saving data contact page 
userSchema.methods.addMassage = async function (name, email, subject, massage) {
    try {
        this.massages = this.massages.concat({ name, email, subject, massage })
        await this.save()
        return this.massages
    } catch (error) {
        console.log(error)
    }
}
export const User = new mongoose.model("users", userSchema)