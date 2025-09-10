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
            updatedAt: new Date()
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

export const createCategory = async (req,res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

         const trimmedName = name.trim();

        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
                error: "MISSING_CATEGORY_NAME"
            });
        }

        const existingCategory = await prisma.category.findFirst({
            where: {
                userId,
                name: {
                    equals: trimmedName,
                    mode: 'insensitive'
                }
            }
        });

        if(existingCategory){
            return res.status(400).json({
                success: false,
                message: "A category with this name already exists",
                error: "CATEGORY_ALREADY_EXISTS"
            });
        }

        const newCategory = await prisma.category.create({
            date: {
                name: trimmedName,
                userId,
                updatedAt: new Date()
            }
        });

        const categoriesWithInfo = {
            id: newCategory.id,
            name: newCategory.name,
            userId: newCategory.userId,
            createdAt: newCategory.createdAt,
            updatedAt: newCategory.updatedAt,
            expenseCount: 0,
            isDefault: false,
            canDelete: true
        };

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: categoriesWithInfo
        })

    } catch (error) {
        console.error("Create category error",error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const getCategoryById = async (req,res) => { 
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId
            },
            include: {
                expenses: {
                    orderBy: { createdAt: 'desc'},
                    take: 5
                },
                _count: {
                    select: { expense: true }
                }
            }
        });

        if( !category ){
            return res.status(404).json({ succes: false, message: "Category not found", error: "CATEGORY_NOT_FOUND"});
        }
        
        const categoriesWithInfo = {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            expenseCount: category._count.expenses,
            isDefault: DEFAULT_CATEGORIES.includes(category.name),
            canDelete: category._count.expenses === 0,
            recentExpense: category.expenses
        }

        res.json({
            message: "Category retrieved succesfully",
            data: categoriesWithInfo
        })

    } catch (error) {
        console.error(`Get category by ID error:`, error);
        res.status(500).json({message:"Server error",error: error.message});
    }
}

export const updateCategoryId = async (req,res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name } = req.body;

        if( !name || name.trim().length ===0 ){
            return res.status(400).json({
                message: "Category name is required",
                error: "MISSING_CATEGORY_NAME"
            })
        }

        const trimmedName = name.trim();
        

        const existingCategory = await prisma.category.findFirst({
            where: { id, userId }
        });

        if(!existingCategory){
            return res.status(404).json({message: 'Category not found',error: "CATEGORY_NOT_FOUND"});
        }

        const duplicateCategory = await prisma.category.findFirst({
            wher: {
                userId,
                name: {
                    equals: trimmedName,
                    mode: 'intensitive'
                },
                id: {
                    not: id
                }
            }
        });

        if (duplicateCategory) {
            return res.status(400).json({
                message: "A category with this name already exists",
                error: "CATEGORY_ALREADY_EXISTS"
            });
        }


        const updatedCategory = await prisma.category.update({
            where: { id },
            data: {
                name: trimmedName,
                updateAt: new Date()
            },
            include: {
                _count: {
                    select: { expenses: true}
                }
            }
        });

         const categoryWithInfo = {
            id: updatedCategory.id,
            name: updatedCategory.name,
            userId: updatedCategory.userId,
            createdAt: updatedCategory.createdAt,
            updatedAt: updatedCategory.updateAt,
            expenseCount: updatedCategory._count.expenses,
            isDefault: DEFAULT_CATEGORIES.includes(updatedCategory.name),
            canDelete: updatedCategory._count.expenses === 0
        };

        res.json({
            message: "Category updated successfully",
            data: categoryWithInfo
        });



    } catch (error) {
        console.error(`Update category error:`, error);
        res.status(500).json({message:"Server error",error: error.message});  
    }
}

export const deleteCategoryId = async (req,res) => {
    try {
        const userId = req.user.id;
        const { id }  = req.params;

        const category = await prisma.category.findFirst({
            where: { id, userId },
            include: {
                _count:{
                    select: { expenses: true}
                }
            }
        })

        if( !category){
            return res.status(404).json({message:"Category not found",error:"CATEGORY_NOT_FOUND"});
        }

        if ( category._count.expense > 0){
            return res.status(400).json({
                message: `Cannot delete category. It is used by ${category._count.expenses}`
            })
        }

    } catch (error) {
                console.error(`Delete category error:`, error);
        res.status(500).json({message:"Server error",error: error.message});  
    }
    
}
   
