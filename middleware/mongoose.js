import mongoose from "mongoose";

const connectDb = handler => async (req,res) => {
    if(mongoose.connections[0].readyState){
        return handler(req,res)
    }

    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
        throw new Error('MONGO_URL is not set in environment. Configure process.env.MONGO_URL before starting the app.');
    }

    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    return handler(req,res)
    
}

export default connectDb;