"use client"
import React, { useEffect, useState } from 'react'
import { UserAnswer } from '@/utils/schema'
import db from '@/utils/db'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
  

function Feedback({params}) {

    const [feedbackList, setFeedbackList] = useState([]);
    const router=useRouter();


    useEffect(()=>{
        GetFeedback();
    },[]);
    const GetFeedback=async ()=>{
        //get feedback for interview
        const result=await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef,params?.interviewId)).orderBy(UserAnswer.id);
        console.log(result);
        setFeedbackList(result);
    }

  return (
    <div className='p-10'>
      
        {feedbackList.length==0?<h2 className='font-bold text-xl text-gray-500'>No feedback available</h2>
        :
        <>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
        <h2 className='font-bold text-2xl '>Here is your interview Result</h2>

        <h2 className='text-primary text-lg  my-3'>Your Overall interview rating : <strong>10/10</strong> </h2>
        <h2 className='text-sm text-gray-500'>Find below interview question with correct answer,Your answer and feedback for improvement</h2>
        {feedbackList&&feedbackList?.map((item,index)=>(
            <Collapsible key={index} className=''>
                <CollapsibleTrigger>
                    <h2 className='flex justify-between p-2 bg-secondary rounded-lg my-2 text-left gap-7'>{item.question} <ChevronsUpDown className='h-5 w-8'/></h2>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{" "+item?.rating}</h2>
                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer :</strong>{" "+item?.userAns}</h2>
                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer :</strong>{" "+item?.correctAns}</h2>
                        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback :</strong>{" "+item?.feedback}</h2>

                    </div>
                    
                </CollapsibleContent>
            </Collapsible>
        ))}

        </>}
        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback