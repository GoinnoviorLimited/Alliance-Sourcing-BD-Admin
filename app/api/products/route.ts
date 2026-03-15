import { connectToDB } from "@/lib/connectToDB";
import { Category } from "@/lib/models/catagory";
import { Products } from "@/lib/models/products";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const project = await Products.find();
  const response = NextResponse.json(project);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if category exists, if not create it
      let category = await Category.findOne({ 
        name: { $regex: new RegExp(`^${body.category}$`, 'i') } 
      }).session(session);

      if (!category) {
        // Create new category with the subcategory
        category = await Category.create([{
          name: body.category,
          subcategories: [{
            name: body.subcategory
          }]
        }], { session });
        category = category[0];
      } else {
        // Check if subcategory exists (case insensitive)
        const subcategoryExists = category.subcategories.some(
          sub => sub.name.toLowerCase() === body.subcategory.toLowerCase()
        );

        if (!subcategoryExists) {
          // Add new subcategory to existing category
          category.subcategories.push({
            name: body.subcategory
          });
          await category.save({ session });
        }
      }

      // Create the product
      const product = await Products.create([{
        ...body,
        category: category.name, // Use the exact category name from DB
        subcategory: body.subcategory
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        data: product[0],
        message: 'Product created successfully with category management'
      }, { status: 201 });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
    }, { status: 400 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const { id } = params;
    const body = await request.json();
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingProduct = await Products.findById(id).session(session);
      
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Handle category/subcategory updates if they changed
      if (body.category || body.subcategory) {
        const newCategory = body.category || existingProduct.category;
        const newSubcategory = body.subcategory || existingProduct.subcategory;

        // Check if category exists
        let category = await Category.findOne({ 
          name: { $regex: new RegExp(`^${newCategory}$`, 'i') } 
        }).session(session);

        if (!category) {
          // Create new category
          category = await Category.create([{
            name: newCategory,
            subcategories: [{
              name: newSubcategory
            }]
          }], { session });
          category = category[0];
        } else {
          // Check if subcategory exists
          const subcategoryExists = category.subcategories.some(
            sub => sub.name.toLowerCase() === newSubcategory.toLowerCase()
          );

          if (!subcategoryExists) {
            category.subcategories.push({
              name: newSubcategory
            });
            await category.save({ session });
          }
        }
      }

      // Update the product
      const updatedProduct = await Products.findByIdAndUpdate(
        id,
        { ...body },
        { new: true, runValidators: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
    }, { status: 400 });
  }
}