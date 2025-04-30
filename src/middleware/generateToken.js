import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
const JWT_SECRET= process.env.JWT_SECRET;


const generateToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');
        }
        const token = jwt.sign(
            {userId: user._id, email: user.email}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h'});
        return token;
    } catch (error) {
        console.error('Error generating token', error);
        throw error
    }
}
export default generateToken;