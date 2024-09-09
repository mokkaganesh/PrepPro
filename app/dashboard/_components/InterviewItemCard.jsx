import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
function InterviewItemCard({interview}) {

    const router=useRouter();
    
    const onFeedback=(id)=>{
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
    }

    const onStart=()=>{
        router.push(`/dashboard/interview/${interview?.mockId}`);
    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jopPosition}</h2>
        <h2 className='tex-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='tex-sm text-gray-500'>Created At: {interview?.createdAt}</h2>
        
        <div className='flex justify-between mt-2 gap-4'>
            <Button size='sm' className='w-full'
            onClick={onFeedback}> Feedback </Button>
          
            <Button size='sm' className='w-full' 
            onClick={onStart}> Start </Button>
        </div>
    </div>
  )
}

export default InterviewItemCard