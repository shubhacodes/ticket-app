import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("Post ran");
  try {
    // we get a req - which will have ticket data
    // creating a form that takes data and we will attach it to the request
    const body = await req.json();
    console.log("Received data:", data);
    const ticketData = body.formData;
    await Ticket.create(ticketData); // this will create the ticket for us
    return NextResponse.json({ message: "Ticket Created!" }, { status: 201 });
  } catch (error) {
    // If an error is caught - return the error with message 'error' in JSON format
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
