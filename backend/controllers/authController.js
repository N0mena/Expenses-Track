import { PrismaClient } from '../generated/prisma/index.js'; 
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
 
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'defaultSecretCode' ,{
        expiresIn: "7d"
    })
};

const isValidEmail = (email) =>{
    return email && typeof email === 'string' && email.length > 10 
    && email.toLocaleLowerCase().endsWith('@gmail.com')
}

export const signup = async (req,res) => {
    try {
        const { email,password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required",
                error: "MISSING_FIELDS"
            })
        }
        if(!isValidEmail(email)){
        return res.status(400).json({
            message : "Only @gmail.com emails are allowed",
            error: 'ONLY_GMAIL_ALLOWED'
        })    
        }

        if(password.length < 6 ){
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            })
        }
        let user;

        if (email){
            user = await prisma.user.findUnique({
                where: { email: email }
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

   if (!isPasswordValid) {
    return res.status(401).json({
        message: "Invalid credentials", 
        error: 'INVALID_CREDENTIALS'
    })
    }

    const hashedPassword = await bcrypt.hash(password,15)

    const defaultUsername = email.split('@')[0] + Math.floor(Math.random() * 1000)
    const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: defaultUsername,
                firstName: 'User',
                lastName: 'Name',
                birthDate
            }
        })

        const token = generateToken(newUser.id)
        
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            },
            token
        })

    } catch (err) {
     console.error(err)
     res.status(500).json({ message: "Server error", error: err.message })   
    }    
}


export const login = async (req,res) => {
    try {
        const { email,username ,password} = req.body

    if((!email && !username )|| !password){
        return res.status(400).json({
            message: "Email or username and passowrd are required",
            error: "MISSING_CREDENTIALS"
        })
    }

    let user = null;


    if(email){
        if(!isValidEmail(email)){
            return res.status(400).json({
                   message: "Only @gmail.com emails are allowed",
                   error: 'ONLY_GMAIL_ALLOWED'
            })
        }
        user = await prisma.user.findUnique({
        where: { email }
    })
    }else if(username){
        user = await prisma.user.findUnique({
            where: { username }
        })
    }


    if(!user){
        return res.status(401).json({
            message: 'Invalid credentials',
            error: "INVALID_CREDENTIALS"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials",
            error: 'INVALID_CREDENTIALS'
        })
    }
     
    const token = generateToken(user.id)

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        },
        token
    })

    } catch (error) {
        console.error('Login error:',error)
        res.status(500).json({
            message:"Server error",
            error: "SERVER_ERROR"
        })
    }
}
