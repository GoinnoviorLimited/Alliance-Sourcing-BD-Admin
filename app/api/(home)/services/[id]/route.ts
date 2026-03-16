import { connectToDB } from "@/lib/connectToDB";
import { ServicesSection } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();

  await connectToDB();

  try {
    const updated = await ServicesSection.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Services Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Services Section successfully updated", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to update services section:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update services section" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await connectToDB();
    const deleted = await ServicesSection.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Services Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Services Section deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to delete services section:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete services section" },
      { status: 500 }
    );
  }
}
