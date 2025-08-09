import mongoose from "mongoose";
import { Env } from "./env.config";


export async function connectToDatabase() {
    await mongoose
        .connect( Env.MONGODB_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        })
      .then(() => {
        console.log("Connected to MongoDB");
      })    
}
