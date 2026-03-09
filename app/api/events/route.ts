import { connectToDB } from "@/lib/connectToDB";
import { Event } from "@/lib/models/home-model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const project = await Event.find();
  const response = NextResponse.json(project);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}