// "use client";
// import React, { useEffect, useState } from 'react'
// import { MockInterview } from "@/utils/schema";
// import db from "@/utils/db";
// import { eq } from "drizzle-orm";
// import { Lightbulb, WebcamIcon } from 'lucide-react';
// import Webcam from 'react-webcam';
// import Link from 'next/link';
// import {Button} from "@/components/ui/button";

// function Interview({params}) {
//     const [interviewDetails, setInterviewDetails] = useState();
//     const [webCamEnabled,setWebCamEnabled]=useState(false);
//     useEffect(() => {
//         console.log(params?.interviewId);
//         GetInterviewDetails();
//     });

//     //this is for getting the interview details
//     const GetInterviewDetails=async ()=>{
//         const result =await db.select().from(MockInterview).where(eq(MockInterview.mockId,params?.interviewId));
//         console.log(result);
//         setInterviewDetails(result[0]);
//     }
//     console.log(interviewDetails?.jopDesc);
//   return (
//     <div className='my-10'>
//         <h2 className='font-bold text-2xl'>Let's Get Started</h2>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
//             <div className='flex flex-col my-5 gap-3 ' >
//                 <div className='flex flex-col p-5 rounded-lg border gap-5'>

//                     <h2 className='text-lg'>
//                         <strong>Job Position/ Job Role: </strong> {interviewDetails?.jopPosition}
//                     </h2>
                
//                     <h2 className='text-lg'>
//                         <strong>Job Description / Tech Stack: </strong>{interviewDetails?.jopDesc}
//                     </h2>
//                     <h2 className='text-lg'>
//                         <strong>Years Of Experience: </strong>{interviewDetails?.jopExperience}
//                     </h2>
//                 </div>
//                 <div className='p-5 border rounded-lg border-yellow-400 bg-yellow-200'>
//                     <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
//                     <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_CAMERA_INFO}</h2>
//                 </div>
//             </div>
//             <div className=''>
//                 {/*webcam*/}
//                 {webCamEnabled ?
//                 <Webcam
//                 onUserMedia={()=>setWebCamEnabled(true)} 
//                 onUserMediaError={()=>setWebCamEnabled(false)}
//                 mirrored={true} 
//                 style={{height:300,width:300}}/> :
//                 <>
//                     <WebcamIcon className='h-72 p-20 w-full my-7 bg-secondary rounded-lg border'/>
//                     <Button variant="ghost" onClick={()=>setWebCamEnabled(true)} className='w-full border rounded-xl' >Enable Web Cam and Microphone</Button>
//                 </>
//                 }
//             </div>
           
//         </div>
//         <div className='flex justify-end items-end'>
//             <Link href={`/dashboard/interview/${params?.interviewId}/start`} >
//                 <Button>Start Interview</Button>
//             </Link>
//         </div>
//     </div>
//   )
// }

// export default Interview


"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MockInterview } from "@/utils/schema";
import db from "@/utils/db";
import GlobalApi from "@/utils/GlobalApi";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Webcam from "react-webcam";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useUser } from "@clerk/nextjs";

function Interview({ params }) {
  const [interviewDetails, setInterviewDetails] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const user=useUser().user;
  console.log(user);

  useEffect(() => {
    console.log(params?.interviewId);
    GetInterviewDetails();

    // Load the TensorFlow.js model when the component mounts
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("Model loaded.");
    };

    loadModel();
  }, [params]);

  // This function gets interview details from the database
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params?.interviewId));
    console.log(result);
    setInterviewDetails(result[0]);
  };

  // This function runs the object detection model
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

  // Function to check for more than one person or specific devices
  const checkForMultiplePersonsOrDevices = (predictions) => {
    const personCount = predictions.filter(pred => pred.class === "person").length;
    const deviceDetected = predictions.some(pred => ["cell phone", "laptop"].includes(pred.class));

    if(personCount === 0) {
        alert("No person detected! Please ensure you are visible in the camera.");
    }

    
    if (personCount > 1 || deviceDetected) {
      alert("Multiple people or a device detected! Please ensure only one person is present and no devices are visible.");
    }
  };

  // Draw the bounding boxes for the detected objects directly on the webcam
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

  // Use an effect to start the detection loop
  useEffect(() => {
    if (webCamEnabled && model) {
      const interval = setInterval(() => {
        detectObjects();
      }, 1000); // Run detection every second

      return () => clearInterval(interval);
    }
  }, [webCamEnabled, model, detectObjects]);

  // Function to send an email
  const sendMailFunction = async () => {
    console.log(user.emailAddresses[0].emailAddress);
    await  GlobalApi.sendEmail({data: {Email: user.emailAddresses[0].emailAddress}});
        
  };


  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-3 ">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Position/ Job Role: </strong>{" "}
              {interviewDetails?.jopPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description / Tech Stack: </strong>
              {interviewDetails?.jopDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years Of Experience: </strong>
              {interviewDetails?.jopExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-400 bg-yellow-200">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_CAMERA_INFO}
            </h2>
          </div>
        </div>
        <div className="relative">
          {/* Webcam and Canvas for object detection */}
          {webCamEnabled ? (
            <>
              <Webcam
                ref={webcamRef}
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                  height: 400,
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
                  height: 400,
                  width: 500,
                }}
              />
            </>
          ) : (
            <>
              <WebcamIcon className="h-72 p-20 w-full my-7 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                onClick={() => setWebCamEnabled(true)}
                className="w-full border rounded-xl"
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
      {webCamEnabled ? 
      <Link href={`/dashboard/interview/${params?.interviewId}/start`}>
        <Button onClick={() => sendMailFunction()} >Start Interview</Button>  
      </Link>  :
      <Button onClick={()=>alert("enable webcam to start")} >Start Interview</Button>}

        
      </div>
    </div>
  );
}

export default Interview;
