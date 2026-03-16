import { connectToDB } from "@/lib/connectToDB";
import { Catalog } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();

  await connectToDB();

  try {
    const updated = await Catalog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Catalog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Catalog successfully updated", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to update catalog:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update catalog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await connectToDB();
    const deleted = await Catalog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Catalog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Catalog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete catalog:", error);
    return NextResponse.json(
      { message: "Failed to delete catalog" },
      { status: 500 }
    );
  }
}
