import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const response=await req.json();
   

    
    const  email = response?.email_address; // Extract email from the request body

    // console.log(email+"  abcd");
    const payload = {
        "email_address": email,
        "public_metadata": {},
        "redirect_url": "https://prep-pro.vercel.app/",
        "notify": true,
        "ignore_existing": false,
        "expires_in_days": 1
    };

    try {
        // Make the request to Clerk's API
        const response = await axios.post('https://api.clerk.com/v1/invitations', payload, {
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, // Use API key from env
                'Content-Type': 'application/json',
            }
        });
        // console.log("this is from send invitation");
        return NextResponse.json({message:"Email Sent Successfully"});
    } catch (error) {
        // console.log("this is from send invitation");
        return NextResponse.json({message:"Email not Sent"});
    }
}
