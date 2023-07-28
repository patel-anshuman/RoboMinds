import axios from "axios";
import React, { useState } from "react";
// Initialization for ES Users
// import { Dropdown, Ripple, initTE } from "tw-elements";

// initTE({ Dropdown, Ripple });

interface InterviewType {
  value: string;
  label: string;
}

const interviewTypes: InterviewType[] = [
  { value: "MERN", label: "MERN Stack" },
  { value: "Node", label: "Node.js" },
  { value: "Java", label: "Java" },
  // Add more interview types here
];

const HomePage: React.FC = () => {
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string>("");
  const [questionList, setQuestionList] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [interviewerResponse, setInterviewerResponse] = useState<string>("");

  const handleStartInterview = async () => {
    if (!selectedInterviewType) return;

    try {
      // Fetch initial set of questions for the selected interview type from the backend
      const response = await axios.get(
        `/api/questions?type=${selectedInterviewType}`
      );
      setQuestionList(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < questionList.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // End of the interview
      setCurrentQuestionIndex(0);
      setQuestionList([]);
      setUserAnswer("");
      setInterviewerResponse("");
    }
  };

  const handleAnswerSubmission = async () => {
    try {
      // Send the user's answer to the backend for processing and receiving an interviewer response
      const response = await axios.post("/api/submitAnswer", {
        question: questionList[currentQuestionIndex],
        answer: userAnswer,
      });
      setInterviewerResponse(response.data.response);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div className="">
      <div className="bg-slate-800 pb-4">
        <h1 className="text-4xl font-normal leading-normal mt-0 mb-2 text-white">
          Interview Simulator
        </h1>
        <div>
          <label className="text-xl font-normal leading-normal mt-0 mb-2 text-pink-800">
            Select Interview Type:-{" "}
          </label>
          <div className="hs-dropdown relative inline-flex [--trigger:hover]">
            <select
              className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
              // className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              value={selectedInterviewType}
              onChange={(e) => setSelectedInterviewType(e.target.value)}
            >
              <option
                value=""
                className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
              >
                Select
              </option>
              {interviewTypes?.map((interviewType) => (
                <option
                  className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  key={interviewType.value}
                  value={interviewType.value}
                >
                  {interviewType.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleStartInterview}
          >
            Start Interview
          </button>
        </div>
      </div>

      {/* {questionList.length > 0 && ( */}

      <div className="QandA">
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{questionList[currentQuestionIndex]} questionList</p>
      </div>

      <div className="feedback">
        <p>Feedback:</p>
        <p>{interviewerResponse}</p>
      </div>

      <div
        // style={{ backgroundColor: "#f0f0f0" }}
        className="inputSection flex justify-center items-center fixed bottom-0 left-0 w-full p-4"
      >
        <div className="flex-grow">
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            rows={3}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>
        <button
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAnswerSubmission}
        >
          Submit Answer
        </button>
        <button
          onClick={handleNextQuestion}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next Question
        </button>
      </div>

      {/* )} */}
    </div>
  );
};

export default HomePage;
