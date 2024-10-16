"use client";

import React, { useState, useEffect } from "react";
import { MockExam } from "@/utils/schema";
import db from "@/utils/db";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ExamPage({ params }) {
  const [examData, setExamData] = useState(null);
  const [generatedExamQuestions, setGeneratedExamQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (params?.examid) {
      GetExamDetails();
    }
  }, [params?.examid]);

  const GetExamDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockExam)
        .where(eq(MockExam.mockExamId, params?.examid));
      const jsonMockResp = result[0]?.examQuestions;

      const questionsArray = Object.values(jsonMockResp);
      setGeneratedExamQuestions(questionsArray);
      setExamData(result[0]);

      setSelectedAnswers(new Array(questionsArray.length).fill(null));
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter full screen:", err);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit full screen:", err);
      });
    }
  };

  const handleOptionChange = (questionIndex, selectedOptionIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = selectedOptionIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const validateAnswers = () => {
    const correctCount = generatedExamQuestions.reduce((count, question, index) => {
      return count + (question.correct === selectedAnswers[index] ? 1 : 0);
    }, 0);

    const validationResults = generatedExamQuestions.map((question, index) => ({
      question: question.question,
      options : question.options,
      selectedAnswerIndex: selectedAnswers[index],
      correctAnswerIndex: question.correct,
      isCorrect: question.correct === selectedAnswers[index],
    }));

    setResult({
      totalQuestions: generatedExamQuestions.length,
      correctCount,
      validationResults,
    });


    
    router.push(`/dashboard/exam/${params?.examid}/feedback`);
  };
  useEffect(()=>{
    sessionStorage.setItem('quizResults',JSON.stringify(result));
  },[result])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Details</h2>

      {examData ? (
        <>
          <p className="mb-2">
            <strong>Created By:</strong> {examData.createdBy}
          </p>
          <p className="mb-4">
            <strong>Created At:</strong> {new Date(examData.createdAt).toLocaleDateString()}
          </p>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Questions:</h3>
            {generatedExamQuestions.length > 0 ? (
              generatedExamQuestions.map((question, questionIndex) => {
                const isAttempted = selectedAnswers[questionIndex] !== null;
                return (
                  <div
                    key={questionIndex}
                    className={`p-4 border border-gray-200 rounded-lg shadow-sm ${
                      isAttempted ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <h4 className="text-lg font-medium mb-2">Question {questionIndex + 1}:</h4>
                    <p className="mb-4">{question.question}</p>

                    <ul className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={optIndex}
                              checked={selectedAnswers[questionIndex] === optIndex}
                              onChange={() => handleOptionChange(questionIndex, optIndex)}
                              className="form-radio text-blue-500"
                            />
                            <span>{option}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            ) : (
              <p>No questions available.</p>
            )}
          </div>

          
          <Button className="mt-6" onClick={validateAnswers}>
            Submit
          </Button>

          {result && (
            <div className="results-section mt-6">
              <h3 className="text-xl font-semibold mb-4">Results:</h3>
              <p className="text-lg mb-4">
                {`You got ${result.correctCount} out of ${result.totalQuestions} correct!`}
              </p>

              <ul className="space-y-4">
                {result.validationResults.map((res, index) => (
                  <li
                    key={index}
                    className={`p-4 rounded-lg shadow-sm ${
                      res.isCorrect ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <p className="font-medium mb-1">
                      <strong>Question {index + 1}:</strong> {res.question}
                    </p>
                    <p>
                      <strong>Your Answer:</strong>{" "}
                      {generatedExamQuestions[index].options[res.selectedAnswerIndex] || "Not Answered"}
                    </p>
                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      {generatedExamQuestions[index].options[res.correctAnswerIndex]}
                    </p>
                    <p className="mt-1">
                      {res.isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>Loading exam details...</p>
      )}
    </div>
  );
}

export default ExamPage;
