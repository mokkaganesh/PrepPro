// "use client"
// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import Webcam from 'react-webcam';
// import { Button } from '@/components/ui/button';
// import { Mic, StopCircle } from 'lucide-react';
// import useSpeechToText from 'react-hook-speech-to-text';
// import { toast } from 'sonner';
// import { chatSession } from '@/utils/AIGeminiModel';
// import db from '@/utils/db';
// import { UserAnswer } from '@/utils/schema';
// import { useUser } from '@clerk/nextjs';
// import moment from 'moment';

// function RecordAnswerSection({mockInterviewQuestions,activeQuestionIndex,interviewData}) {
//     const [userAnswer, setUserAnswer] = useState('');
//     const {user}=useUser();
//     const [loading, setLoading] = useState(false);

//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//         setResults
//       } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//       });

//       useEffect(() => {
//         // console.log(results);
//         //bhbjknbjhbk,n
//         results.map((result) => {
//           console.log("ytytyifyfuy  "+result?.transcript);
//             setUserAnswer(prev=>prev+result?.transcript);
//         });
//       }
//         ,[results])

//       useEffect(() => { 
//         if((!isRecording)&& userAnswer?.length > 10){
//             UpdateUserAnswer();
//         }
//       }, [userAnswer,isRecording]);

//       const StartStopRecording=async()=>{
//           if(isRecording){
//               stopSpeechToText();
//               /*const feedbackprompt = `Question : ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer : ${userAnswer} ,Depends on question ans user answer for given interview question, please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

//               const result =await chatSession.sendMessage(feedbackprompt);
//               console.log(result);
//               const mockJsonResp=(result.response.text()).replace('```json','').replace('```','').trim();
              
//               const JsonFeedbackResp=JSON.parse(mockJsonResp);

//               // setUserAnswer('');
              
//               const resp=await db.insert(UserAnswer).values({
//                   mockIdRef:interviewData?.mockId,
//                   question:mockInterviewQuestions[activeQuestionIndex]?.question,
//                   correctAns:mockInterviewQuestions[activeQuestionIndex]?.answer,
//                   userAns:userAnswer,
//                   feedback:JsonFeedbackResp?.feedback,
//                   rating:JsonFeedbackResp?.rating,
//                   userEmail:user?.primaryEmailAddress.emailAddress,
//                   createdAt:moment().format('DD-MM-YYYY HH:mm:ss')    ,
//               }).returning({mockIdRef:UserAnswer.mockIdRef});

//               if(resp){
//                   toast('Answer recorded successfully');
//               }
//               setUserAnswer('');
//               setLoading(false);*/
//           }else{
//               // setUserAnswer('');
//               startSpeechToText();
//           }
//           console.log(userAnswer);  
//       }

//       const UpdateUserAnswer=async()=>{
//         console.log(userAnswer);
//         setLoading(true);
//         const feedbackprompt = `Question : ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer : ${userAnswer} ,Depends on question ans user answer for given interview question, please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

//         const result =await chatSession.sendMessage(feedbackprompt);
//         console.log(result);
//         const mockJsonResp=(result.response.text()).replace('```json','').replace('```','').trim();
        
//         const JsonFeedbackResp=JSON.parse(mockJsonResp);

//         // setUserAnswer('');
        
//         const resp=await db.insert(UserAnswer).values({
//             mockIdRef:interviewData?.mockId,
//             question:mockInterviewQuestions[activeQuestionIndex]?.question,
//             correctAns:mockInterviewQuestions[activeQuestionIndex]?.answer,
//             userAns:userAnswer,
//             feedback:JsonFeedbackResp?.feedback,
//             rating:JsonFeedbackResp?.rating,
//             userEmail:user?.primaryEmailAddress.emailAddress,
//             createdAt:moment().format('DD-MM-YYYY HH:mm:ss')    ,
//         }).returning({mockIdRef:UserAnswer.mockIdRef});

//         if(resp){
//             toast('Answer recorded successfully');
//             setResults([]);
//             setUserAnswer('');
//           }
//           setResults([]);
//         // setUserAnswer('');
//         setLoading(false);
//       }


//   return (
//     <div className='flex items-center justify-center flex-col my-20'>
//         <div className='flex flex-col mt-15 justify-center items-center bg-black rounded-lg'>
//             <Image src={'/logo.svg'} width={200} height={200} className='absolute'/>
//             <Webcam
//             mirrored={true}
//             style={{height:300,
//                 width:'100%',
//                 zIndex:10,
//             }}/>
//         </div>
    
//         <Button 
//         disabled={loading}
//         variant='outline' className='my-10'
//         onClick={StartStopRecording}>
//             {isRecording ?
//                 <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
//                 <StopCircle/> stop recording
//                 </h2>
//                 :
//                 <h2 className='text-primary flex gap-2 items-center'>
//                    <Mic/> Record Answer
//                 </h2>
//             }
//         </Button>
            
        
//     </div>
//   )
// }

// export default RecordAnswerSection

"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/utils/AIGeminiModel";
import db from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    // Load the TensorFlow.js model when the component mounts
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("Model loaded.");
    };

    loadModel();
  }, []);

  useEffect(() => {
    results.forEach((result) => {
      console.log("Result: " + result?.transcript);
      setUserAnswer((prev) => prev + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer, isRecording]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
    console.log(userAnswer);
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackprompt = `Question : ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer : ${userAnswer}, Depends on question ans user answer for given interview question, please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field.`;

    const result = await chatSession.sendMessage(feedbackprompt);
    console.log(result);
    const mockJsonResp = result.response.text().replace("```json", "").replace("```", "").trim();

    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestions[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress.emailAddress,
      createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
    }).returning({ mockIdRef: UserAnswer.mockIdRef });

    if (resp) {
      toast("Answer recorded successfully");
      setResults([]);
      setUserAnswer("");
    }
    setResults([]);
    setLoading(false);
  };

  // Object detection logic
  const detectObjects = useCallback(async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      if (video.readyState === 4) {
        const predictions = await model.detect(video);
        drawPredictions(predictions);
        checkForMultiplePersonsOrDevices(predictions);
      }
    }
  }, [model]);

  const checkForMultiplePersonsOrDevices = (predictions) => {
    const personCount = predictions.filter((pred) => pred.class === "person").length;
    const deviceDetected = predictions.some((pred) =>
      ["cell phone", "laptop"].includes(pred.class)
    );

    if (personCount === 0) {
      alert("No person detected! Please ensure you are visible in the camera.");
    }

    if (personCount > 1 || deviceDetected) {
      alert("Multiple people or a device detected! Please ensure only one person is present and no devices are visible.");
    }
  };

  const drawPredictions = (predictions) => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = "18px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  useEffect(() => {
    if (model) {
      const interval = setInterval(() => {
        detectObjects();
      }, 1000); // Run detection every second

      return () => clearInterval(interval);
    }
  }, [model, detectObjects]);

  return (
    <div className="flex items-center justify-center flex-col my-20">
      <div className="flex flex-col mt-15 justify-center items-center bg-black rounded-lg relative">
        <Image src={"/logo.svg"} width={200} height={200} className="absolute" />
        <Webcam
          mirrored={true}
          ref={webcamRef}
          style={{
            height: 300,
            width: 500,
          }}
        />
        {/* Canvas for drawing predictions directly on top of the webcam */}
        <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 300,
                  width: 500,
                }}
              />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle /> stop recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;


