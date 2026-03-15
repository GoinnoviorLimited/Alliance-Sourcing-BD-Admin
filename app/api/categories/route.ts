// app/api/categories/route.js
import { connectToDB } from '@/lib/connectToDB';
import { Category } from '@/lib/models/catagory';
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

    // Check if category already exists
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
        }
      }

      return NextResponse.json({
        success: true,
        data: existingCategory,
        message: 'Category updated with new subcategory'
      });
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