import mongoose from "mongoose";
const baseUrl = process.env.MOGO_URI || 'mongodb://localhost:27017/task-app'

const db = async () => {
    console.log(baseUrl)
    try {
        await mongoose.connect(baseUrl)
        console.log('DB connected')
    } catch (error) {
        console.log(error)
    }
}
export default db
