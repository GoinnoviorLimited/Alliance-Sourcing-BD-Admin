import { connectToDB } from "@/lib/connectToDB";
import { BuyingHouse } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();

  await connectToDB();

  try {
    const updated = await BuyingHouse.findByIdAndUpdate(id, data, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Project data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update data:", error);
    return NextResponse.json(
      { message: "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await connectToDB();
    const deleted = await BuyingHouse.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: " data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: " data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete  data" },
      { status: 500 }
    );
  }
}

