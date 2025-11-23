import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    count?: number;
    datecreated?: Date;
}

const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    count: { type: Number, default: 0 },
    datecreated: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
