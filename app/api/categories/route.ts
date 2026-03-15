import { connectToDB } from '@/lib/connectToDB';
import { Category } from '@/lib/models/catagory';
import { Products } from '@/lib/models/products';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category) {
      query.name = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    const categories = await Category.find(query)
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
    }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    // Check if category already exists (case insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    });

    if (existingCategory) {
      // Add subcategory to existing category
      if (body.subcategory) {
        const subcategoryExists = existingCategory.subcategories.some(
          sub => sub.name.toLowerCase() === body.subcategory.toLowerCase()
        );

        if (!subcategoryExists) {
          existingCategory.subcategories.push({
            name: body.subcategory
          });
          await existingCategory.save();
          
          return NextResponse.json({
            success: true,
            data: existingCategory,
            message: 'Subcategory added successfully'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Subcategory already exists'
          }, { status: 400 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'Category already exists'
        }, { status: 400 });
      }
    }

    // Create new category
    const category = await Category.create({
      name: body.name,
      subcategories: body.subcategory ? [{ name: body.subcategory }] : []
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
    }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('name');
    const categoryToDelete = searchParams.get('category');
    const subcategoryToDelete = searchParams.get('subcategory');

    // Delete subcategory from category
    if (categoryToDelete && subcategoryToDelete) {
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryToDelete}$`, 'i') }
      });

      if (!category) {
        return NextResponse.json({
          success: false,
          error: 'Category not found'
        }, { status: 404 });
      }

      // Remove subcategory
      category.subcategories = category.subcategories.filter(
        sub => sub.name.toLowerCase() !== subcategoryToDelete.toLowerCase()
      );
      
      await category.save();

      // Optional: Update products that use this subcategory
      await Products.updateMany(
        { 
          category: categoryToDelete,
          subcategory: subcategoryToDelete 
        },
        { 
          $set: { subcategory: 'Uncategorized' } 
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Subcategory deleted successfully'
      });
    }

    // Delete entire category
    if (categoryName) {
      // Check if category has products
      const productsCount = await Products.countDocuments({
        category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
      });

      if (productsCount > 0) {
        return NextResponse.json({
          success: false,
          error: `Cannot delete category with ${productsCount} associated products. Update or delete products first.`
        }, { status: 400 });
      }

      const result = await Category.findOneAndDelete({
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
      });

      if (!result) {
        return NextResponse.json({
          success: false,
          error: 'Category not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Category deleted successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request'
    }, { status: 400 });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({
      success: false,
    }, { status: 400 });
  }
}