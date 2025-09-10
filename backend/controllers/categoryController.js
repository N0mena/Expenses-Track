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
        const defaultCategories = DEFAULT_CATEGORIES.map(name => ({
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
        console.error('Error creating default categories', error);
        throw error;
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            include: {
                _count: {
                    select: { expenses: true }
                }
            }
        });

        const categoriesWithInfo = categories.map(category => ({
            id: category.id,
            name: category.name,
            userId: category.userId,
            createdAt: category.createdAt,
            updatedAt: category.updateAt,
            expenseCount: category._count.expenses,
            isDefault: DEFAULT_CATEGORIES.includes(category.name),
            canDelete: category._count.expenses === 0
        }));

         res.json({
            success: true,
            message: "Categories retrieved successfully",
            data: {
                categories: categoriesWithInfo,
                total: categoriesWithInfo.length,
                defaultCount: categoriesWithInfo.filter(cat => cat.isDefault).length,
                customCount: categoriesWithInfo.filter(cat => !cat.isDefault).length
            }
        });

    } catch (error) {
       console.error('Get categories error:', error);
        res.status(500).json({success: false,message: "Server error",error: error.message
        });
    }
}
