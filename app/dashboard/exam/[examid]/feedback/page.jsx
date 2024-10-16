"use client";
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Feedback({ params }) {
  const [feedbackData, setFeedbackData] = useState(null); // Store the entire feedback data object
  const router = useRouter();

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('quizResults');
    console.log(storedResults);
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setFeedbackData(parsedResults);
      } catch (error) {
        console.error('Error parsing stored results:', error);
        setFeedbackData(null);
      }
    } else {
      console.error('No quiz results found in session storage.');
    }
  }, []);


  if (!feedbackData) {
    return <h2 className='font-bold text-xl text-gray-500'>No feedback available</h2>;
  }

  const { totalQuestions, correctCount, validationResults } = feedbackData;

  const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit full screen:", err);
      });
    }
  };

  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
      <h2 className='font-bold text-2xl '>Here is your quiz result</h2>
      <h2 className='text-primary text-lg my-3'>
        Your Overall Score: <strong>{correctCount} / {totalQuestions}</strong>
      </h2>
      <h2 className='text-sm text-gray-500'>
        Find below each question with your answer, the correct answer, and feedback for improvement:
      </h2>
      {validationResults.map((item, index) => (
        <Collapsible key={index} className=''>
          <CollapsibleTrigger>
            <h2 className='flex justify-between p-2 bg-secondary rounded-lg my-2 text-left gap-7'>
              {item.question} <ChevronsUpDown className='h-5 w-8' />
            </h2>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2'>
              
              <h2 className={`p-2 border rounded-lg ${item.isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                <strong>{`${item.options[0]}   ${item.options[1]}   ${item.options[2]}   ${item.options[3]}`}</strong> <br />
                <strong>{item.isCorrect ? 'Correct' : 'Incorrect'}</strong>
              </h2>
              <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'>
                <strong>Your Answer:</strong> {item.selectedAnswerIndex !== null ? item.selectedAnswerIndex + 1 : "Not Answered"}
              </h2>
              <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                <strong>Correct Answer:</strong> {item.correctAnswerIndex + 1}
              </h2>
              <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'>
                <strong>Feedback:</strong> {item.isCorrect ? "Great job!" : "Consider reviewing this topic."}
              </h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
        <Button onClick={() => router.replace('/dashboard')} className='mt-4'>
            Go Home
        </Button>
        <Button 
                onClick={exitFullScreen}>
                Exit Full Screen
        </Button>
    </div>
  );
}

export default Feedback;
