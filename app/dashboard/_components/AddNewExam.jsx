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
import { MockExam } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import Select from 'react-select';


function AddNewExam() {

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
       
       const InputPrompt=`give me 10 apptitude questions for placement exam

topics : 

trains -> 2 questions

boats ->2 questions

work -> 2 questions

ratios -> 2questions

speed distance -> 2questions



give me the four options for each question

and provide the correct answer

{

question1 :{question :{""},options:[],correct:option index}

question2:{question :{""},options:[],correct:option index}

.....

question n :{question :{""},options:[],correct:option index}

}



give the data in the form of json`;
         console.log(InputPrompt);
         
       const result = await chatSession.sendMessage(InputPrompt);
       console.log(result);
       const jsonResponse =(result.response.text()).replace('```json','').replace('```','').trim();
       console.log(typeof jsonResponse);
       const jsonanswer = JSON.parse(jsonResponse);
       console.log( JSON.parse(jsonResponse)); 
         setJSONResponse(jsonResponse);
         
        //store in database
        if(user&&jsonResponse){

            const resp=await db.insert(MockExam).values({
                examQuestions : jsonanswer,
                createdBy:user?.primaryEmailAddress.emailAddress,
                createdAt:moment().format('DD-MM-YYYY HH:mm:ss')    ,
                mockExamId:uuidv4(),
            }).returning({mockExamId:MockExam.mockExamId});

            console.log("INSERTED ID : "+resp);

            if(resp){
                setIsOpen(false);
                router.push(`/dashboard/exam/${resp[0].mockExamId}`);
            }
        }else{
            console.log("Error in storing data");
        
        }

         setLoading(false);
    }

    const options = [
        { value: 'apptitude', label: 'Apptitude' },
        { value: 'reasoning', label: 'Reasoning' },
        { value: 'coding', label: 'Coding' }
      ]
  return (
    <div className="p-5">
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setIsOpen(true)}>
            <h2 className=' text-lg text-center'>+ Add New Exam</h2>
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
                            {/* <label htmlFor="">Job Description/Tech Stack </label>
                            <Textarea className='mt-1' placeholder='Ex. PowerBI, tableau, SQL, R, Python etc. ' required
                            onChange={(e) => setJobDescription(e.target.value)}
                            /> */}
                            <Select options={options}/>
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
                            </> : 'Start Exam'
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

export default AddNewExam