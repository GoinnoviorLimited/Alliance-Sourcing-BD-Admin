import { connectToDB } from "@/lib/connectToDB";
import { ServicesSection } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const services = await ServicesSection.find().sort({ createdAt: -1 });
  const response = NextResponse.json(services);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDB();
    await ServicesSection.create(data);
    return NextResponse.json(
      { message: "Services Section created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating services section:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create services section" },
      { status: 500 }
    );
  }
}
