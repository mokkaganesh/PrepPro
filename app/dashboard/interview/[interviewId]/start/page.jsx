
"use client";
import React from 'react'
import { useEffect, useState} from 'react'
import { MockInterview } from '@/utils/schema'
import db from '@/utils/db'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link';




function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    // Run GetInterviewDetails only once when component mounts or when params.interviewId changes
    useEffect(() => {
        if (params?.interviewId) {
            GetInterviewDetails();
        }
    }, [params?.interviewId]); // Add dependency array with interviewId

    //this is for getting the interview details
    const GetInterviewDetails=async ()=>{
        const result =await db.select().from(MockInterview).where(eq(MockInterview.mockId,params?.interviewId));
        console.log(result);
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
    }
    console.log(mockInterviewQuestions);
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/*Questiona */}
            <div>
               <QuestionsSection mockInterviewQuestions={mockInterviewQuestions}
               activeQuestionIndex={activeQuestionIndex}
               />
            </div>
            {/* Video  /audio recording */}
            <div>
                <RecordAnswerSection mockInterviewQuestions={mockInterviewQuestions}
               activeQuestionIndex={activeQuestionIndex}
               interviewData={interviewData}/>
            </div>
        </div>
        <div className='flex justify-end gap-6'>
            {activeQuestionIndex>0&& <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>previous Question</Button>}
            {activeQuestionIndex!=mockInterviewQuestions?.length-1&& <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {
            activeQuestionIndex==mockInterviewQuestions?.length-1&& 
            <Link href={`/dashboard/interview/${params?.interviewId}/feedback`}>
                <Button >End Interview</Button>            
            </Link>
            }
        </div>
    </div>
  )
}

export default StartInterview
