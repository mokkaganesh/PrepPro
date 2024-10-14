"use client";

import React, { useState, useEffect } from "react";
import { MockExam } from "@/utils/schema";
import db from "@/utils/db";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";

function ExamPage({ params }) {
  const [examData, setExamData] = useState(null);
  const [generatedExamQuestions, setGeneratedExamQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Store selected option indexes
  const [result, setResult] = useState(null); // Store validation result

  useEffect(() => {
    if (params?.examid) {
      GetExamDetails();
    }
  }, [params?.examid]);

  const GetExamDetails = async () => {
    try {
      const result = await db.select().from(MockExam).where(eq(MockExam.mockExamId, params?.examid));
      const jsonMockResp = result[0]?.examQuestions;
      console.log(result[0]);
      console.table(jsonMockResp);

      const questionsArray = Object.values(jsonMockResp);
      setGeneratedExamQuestions(questionsArray);
      setExamData(result[0]);

      // Initialize selected answers array to null for each question
      setSelectedAnswers(new Array(questionsArray.length).fill(null));
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  };

  // Handler for selecting an option
  const handleOptionChange = (questionIndex, selectedOptionIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = selectedOptionIndex; // Update the selected option index
    setSelectedAnswers(updatedAnswers);
  };

  // Validate answers on form submission
  const validateAnswers = () => {
    let correctCount = 0;
    let validationResults = generatedExamQuestions.map((question, index) => {
      const isCorrect = question.correct === selectedAnswers[index]; // Compare indexes
      if (isCorrect) correctCount++;
      return {
        question: question.question,
        selectedAnswerIndex: selectedAnswers[index], // Store index of selected answer
        correctAnswerIndex: question.correct, // Correct index from the question data
        isCorrect,
      };
    });

    setResult({
      totalQuestions: generatedExamQuestions.length,
      correctCount,
      validationResults,
    });
  };

  return (
    <div>
      <h2>Exam Details</h2>

      {examData ? (
        <>
          <p><strong>Created By:</strong> {examData.createdBy}</p>
          <p><strong>Created At:</strong> {examData.createdAt}</p>

          <div>
            <h3>Questions:</h3>
            {generatedExamQuestions.length > 0 ? (
              generatedExamQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="question-block">
                  <h4>Question {questionIndex + 1}:</h4>
                  <p>{question.question}</p>

                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${questionIndex}`} // Unique group for each question
                            value={optIndex}
                            checked={selectedAnswers[questionIndex] === optIndex} // Check if the option is selected
                            onChange={() => handleOptionChange(questionIndex, optIndex)} // Handle change by storing option index
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </div>

          <Button onClick={validateAnswers}>Submit</Button>

          {result && (
            <div className="results-section">
              <h3>Results:</h3>
              <p>{`You got ${result.correctCount} out of ${result.totalQuestions} correct!`}</p>

              <ul>
                {result.validationResults.map((res, index) => (
                  <li key={index} style={{ color: res.isCorrect ? "green" : "red" }}>
                    <p><strong>Question {index + 1}:</strong> {res.question}</p>
                    <p><strong>Your Answer:</strong> {generatedExamQuestions[index].options[res.selectedAnswerIndex]}</p>
                    <p><strong>Correct Answer:</strong> {generatedExamQuestions[index].options[res.correctAnswerIndex]}</p>
                    <p>{res.isCorrect ? "Correct!" : "Incorrect"}</p>
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
