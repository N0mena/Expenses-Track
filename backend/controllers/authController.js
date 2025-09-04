import { PrismaClient } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
 
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, 'defaultSecretCode' ,{
        expiresIn: "1d"
    })
};

export const register = async (req,res) => {

    try {
        const { email, password, userName, firstName , lastName , birthDate } = req.body

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        
        if(existingUser) {
            return res.status(400).json({message: "Email is already in use"})
        }

    const hashedPassword = await bcrypt.hash(password, 15 )
        
    const newUser = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName,
            birthDate,
            userName,
            password: hashedPassword,
        },
    })

    const token = generateToken(newUser.id)

    res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser.id, email: newUser.email, username: newUser.userName, firstName: newUser.firstName, lastName: newUser.lastName, birthDate: newUser.b},
    token,
})

    } catch (err) {
     console.error(err)
     res.status(500).json({ message: "Server error", error: err.message })   
    }
}
