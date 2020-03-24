import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const model = mongoose.model('User', userSchema);

export default model;