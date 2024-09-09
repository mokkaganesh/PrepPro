import React from 'react'
import { Lightbulb, Volume2 } from 'lucide-react'

function QuestionsSection({mockInterviewQuestions,activeQuestionIndex}) {

    const textToSpeech=(text)=>{
        if('speechSynthesis' in window){
                const synth = window.speechSynthesis;
                const speech = new SpeechSynthesisUtterance(text);
                synth.speak(speech);
        }else{
            alert('Your browser does not support text to speech');
        }

    }
  return mockInterviewQuestions&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestions&&mockInterviewQuestions?.map((question,index)=>(
                <h2 className={`p-2 text-center bg-secondary rounded-full text-xs md:text-sm cursor-pointer ${activeQuestionIndex==index &&'bg-green-500 text-white'}`}>Question #{index+1}</h2>
            ))}

        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>
        <Volume2  className='cursor-pointer mb-5' onClick={()=>textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5 bg-blue-100 mt-15'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note: </strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>
                {process.env.NEXT_PUBLIC_CAMERA_INFO}
            </h2>
        </div>
    </div>
  )
}

export default QuestionsSection