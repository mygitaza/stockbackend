import mongoose from 'mongoose';
import stockSchema from './stockModel.js';
import bcrypt  from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
    stocks: [stockSchema]
}, {
    timestamps: true 
});

// hash password
userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
})

// compare password
userSchema.methods.comparePassword = async function(givenPassword){
    return await bcrypt.compare(givenPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;