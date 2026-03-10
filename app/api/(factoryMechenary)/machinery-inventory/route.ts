import { connectToDB } from "@/lib/connectToDB";
import { MachineryInventory } from "@/lib/models/factoryAndMachenary-model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const project = await MachineryInventory.find();
  const response = NextResponse.json(project);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Connect to the database
    await connectToDB();
    await MachineryInventory.create(data);
    return NextResponse.json(
      { message: "Data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json(
      { message: "Failed to create data" },
      { status: 500 }
    );
  }
}