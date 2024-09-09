import { Resend } from "resend";
import { NextResponse } from "next/server";
import EmailTemplate from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req, res) {
 
    const response=await req.json();
    // console.log(response);
    // console.log(response.data.Email);
    try{
        const data =await resend.emails.send({
            // from: 'Interview@send.com',
            from: 'onboarding@resend.dev',
            to: [response.data.Email],
            subject: 'Mock Interview Schedule',
            react: EmailTemplate({response})
        });
        return NextResponse.json({message:"Email Sent Successfully"});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error:err.message},500);
    }
}