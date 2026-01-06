import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/cookies.util.js';
import { sendVerificationEmail } from '../mailtrap/emails.mailtrap.js';

export async function signup(req, res) {
    const {email,username,password}=req.body;
    try{
        if(!email || !username || !password){
            return res.status(400).json({message:'All fields are required'});
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:'User already exists'});
        }
        if(password.length<6){
            return res.status(400).json({message:'Password must be at least 6 characters long'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 3600000); 
        

        const user = await User.create({
            email,
            username, 
            password: hashedPassword, 
            verificationToken, 
            verificationTokenExpiresAt
        });

        generateTokenAndSetCookie(res, user._id)
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            email:user.email,
            username:user.username,
            message:'User created successfully',
            success:true
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function verifyEmail (req,res) {
    try {
        const {code} = req.body
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresAt: { $gt: Date.now() }
            });
        
        if(!user){
            return  res.status(400).json({message:'Invalid or expired verification code'});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        res.status(200).json({message:'Email verified successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({
            email: user.email,
            username: user.username,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}