"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { useState } from "react";
  import {Button} from "@/components/ui/button";
    import {Input} from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea"
import { chatSession } from "@/utils/AIGeminiModel";
import { LoaderCircle } from "lucide-react";
import db from "@/utils/db";
import { v4 as uuidv4 } from 'uuid';
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {

    const [isOpen, setIsOpen] = useState(false);
    const [jobPosition, setJobPostion] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [JSONResponse, setJSONResponse] = useState([]);
    const {user}=useUser();

    const router=useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDescription, jobExperience);
       // setIsOpen(false);  //it will directly close the dialog box
       
       const InputPrompt=`Job Position : ${jobPosition}, Job Description: ${jobDescription}, Years of Experience : ${jobExperience} , Depends on this information please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} questions with Answered in JSON format, Give Question and Answered as filed in JSON`;
         console.log(InputPrompt);
         
       const result = await chatSession.sendMessage(InputPrompt);
       const jsonResponse =(result.response.text()).replace('```json','').replace('```','').trim();
       console.log(JSON.parse(jsonResponse)); 
         setJSONResponse(jsonResponse);
         
        //store in database
        if(user&&jsonResponse){

            const resp=await db.insert(MockInterview).values({
                jsonMockResp:jsonResponse,
                jopPosition:jobPosition,
                jopDesc:jobDescription,
                jopExperience:jobExperience,
                createdBy:user?.primaryEmailAddress.emailAddress,
                createdAt:moment().format('DD-MM-YYYY HH:mm:ss')    ,
                mockId:uuidv4(),
            }).returning({mockId:MockInterview.mockId});

            console.log("INSERTED ID : "+resp);

            if(resp){
                setIsOpen(false);
                router.push(`/dashboard/interview/${resp[0].mockId}`);
            }
        }else{
            console.log("Error in storing data");
        
        }

         setLoading(false);
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setIsOpen(true)}>
            <h2 className=' text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={isOpen}>
            
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                <DialogTitle className='text-2xl'>Tell us more about your job interviewing</DialogTitle>
                <DialogDescription>
                <form onSubmit={onSubmit}>
                    <div>

                        <h2>Add Details about your job position/role, Job description and years of experience</h2>
                        <div className="mt-7 my-2">
                            <label htmlFor="">Job Role/Job posistion</label>
                            <Input className='mt-1' placeholder='Ex. Data Analyst' required
                                onChange={(e) => setJobPostion(e.target.value)}
                            />
                        </div>
                        <div className="mt-7 my-3">
                            <label htmlFor="">Job Description/Tech Stack </label>
                            <Textarea className='mt-1' placeholder='Ex. PowerBI, tableau, SQL, R, Python etc. ' required
                            onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <div className="mt-7 my-2">
                            <label htmlFor="">Years of experience</label>
                            <Input className='mt-1' placeholder='5' type="number" max="50" required
                            onChange={(e) => setJobExperience(e.target.value)}
                            />
                        </div>

                    </div>
                    
                    <div className="flex gap-5 justify-end">
                        <Button variant="ghost" onClick={()=>setIsOpen(false)}>Cancel</Button>
                        <Button type='submit' disabled={loading}>
                            
                            {loading ? 
                            <>
                            <LoaderCircle className="animate-spin"/>'Generating From AI'
                            </> : 'Start Interview'
                            }

                        </Button>
                    </div>
                </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>


    </div>
  )
}

export default AddNewInterview