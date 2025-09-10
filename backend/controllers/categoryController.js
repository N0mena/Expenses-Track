import { PrismaClient } from "../generated/prisma/index.js"

const prisma = new PrismaClient();

export const DEFAULT_CATEGORIES = [
        "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Personal Care",
    "Home & Garden",
    "Insurance",
    "Gifts & Donations",
    "Business",
    "Others"
];

export const createDefaultCategories = async (userId) => {
    try {
        const defaultCategories = DEFAULT_CATEGORIES.map(name =>({
            name,
            userId,
            createdAt: new Date(),
            updateAt: new Date()
        }));

        await prisma.category.createMany({
            data: defaultCategories
        });
        console.log(`Default categories created for user ${userId}`);

    } catch (error) {
        console.error('Error creating default categories',error);
        throw error;
    }
};

