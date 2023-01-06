import mongoose from "mongoose";

mongoose.set('strictQuery', true);
export const mydatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE)
        console.log(`Database connected`)
    } catch (error) {
        console.log(error)
    }
}
