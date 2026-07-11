import mongoose from "mongoose"

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI)
        .then((con) => {
            console.log(`Mongodb connected with HOST:${con.connection.host}`)
        })
        .catch((err) => {
            console.error(`MongoDB connection error: ${err.message}`)
            process.exit(1)
        })
}

export default connectDatabase