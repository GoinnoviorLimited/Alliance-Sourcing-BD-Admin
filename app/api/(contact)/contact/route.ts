import { connectToDB } from "@/lib/connectToDB";
import { Contact } from "@/lib/models/contact-model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const project = await Contact.find();
  const response = NextResponse.json(project);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     // Connect to the database
//     await connectToDB();
//     await Contact.create(data);
//     return NextResponse.json(
//       { message: "Data created" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating data:", error);
//     return NextResponse.json(
//       { message: "Failed to create data" },
//       { status: 500 }
//     );
//   }
// }


export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDB();
    const contact = await Contact.create(body);

    return NextResponse.json(
      { success: true, data: contact },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating data" },
      { status: 500 }
    );
  }
}