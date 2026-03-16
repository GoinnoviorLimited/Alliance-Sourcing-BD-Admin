import { connectToDB } from "@/lib/connectToDB";
import { Catalog } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const catalogs = await Catalog.find().sort({ createdAt: -1 });
  const response = NextResponse.json(catalogs);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDB();
    await Catalog.create(data);
    return NextResponse.json(
      { message: "Catalog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating catalog:", error);
    return NextResponse.json(
      { message: "Failed to create catalog" },
      { status: 500 }
    );
  }
}
