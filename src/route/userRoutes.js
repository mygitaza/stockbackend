import express from 'express';
import User from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import generateToken from '../middleware/generateToken.js';

const router = express.Router();

// registe user
router.post('/register', async (req, res)=>{
    try {
        const {firstName,lastName,phone,country,address,zipCode,email,password,role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already registered'})
        }

        const newUser = new User({firstName,lastName,phone,country,address,zipCode,email,password, role: role || 'user',});
        await newUser.save();

        const token = await generateToken(newUser._id);

        
res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                country: newUser.country,
                address: newUser.address,
                zipCode: newUser.zipCode,
                role: newUser.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                country: user.country,
                address: user.address,
                zipCode: user.zipCode,
                role: user.role,
            }
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

router.post('/logout', async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({message: 'Logout successful'})
    } catch (error) {
        console.error(error, 'Failed to log out');
        res.status(500).json({message: 'Logout failed! Try again'})
    }
});

router.get('/users', async (req,res)=>{
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/users/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        await user.deleteOne();
        res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;
