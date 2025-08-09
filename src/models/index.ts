// import mongoose from 'mongoose';


// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
// }, { timestamps: true });

// const messageSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     content: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);
// const Message = mongoose.model('Message', messageSchema);

// export { User, Message };


export * from './user.model';
export * from './wallet.model';
export * from './msg.model'
export * from './callHistory.model'
import { Types } from 'mongoose'

export const ObjectId = Types.ObjectId
// export * from './chat.module';