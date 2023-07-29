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
  { value: "mern", label: "MERN" },
  { value: "node", label: "NODE" },
  { value: "java", label: "JAVA" },
  // Add more interview types here
];

interface InterviewData {
  job_title: string;
  topics: string[];
}

const courseData: { [key: string]: InterviewData } = {
  mern: {
    job_title: "Frontend Software Developer",
    topics: [
      "UseEffect",
      "Different ways of using useEffect",
      "Routing revision",
      "Private route",
      "State Management",
      "Different hooks for state management",
      "useState",
      "useReducer",
      "useRef",
      "Rules of hooks",
      "Custom hooks",
      "useDebounce hook",
      "useThrottle hook",
      "Generic or custom components",
      "Creating a custom OTP/PIN component",
      "MVC and Flux architecture",
      "Why redux",
      "Basic redux architecture",
      "React Redux",
      "useSelector",
      "useDispatch",
      "Using the store",
      "using shallowEqual check",
      "Using multiple reducers",
      "Combinereducer",
      "Scaling the existing application",
      "Middleware",
      "Redux thunk",
      "Putting all logic part in action",
      "Creating thunk from scratch",
      "Redux dev tools",
      "Styled components",
      "Filtering",
      "useSearchParams hook",
      "useLocation hook",
      "Persisting the data based on query params",
      "Filtering",
      "Adding multiple filters",
      "Params object in axios",
      "Edit functionality",
      "Sorting",
      "Edit functionality",
      "Importance of optimization",
      "useMemo",
      "useCallback",
      "memo",
      "Visualizing optimization using profiler",
      "What is TypeScript",
      "Compiled and transpiled language",
      "Static and dynamic language",
      "Data types in TS",
      "Object and Array in TS",
      "Union and Intersection",
      "Functions",
      "Tuple, generic function, class, and interface",
      "Creating a React project with TS",
      "Creating a todo with react-ts",
      "CRUD operations",
      "What is testing?",
      "TBD (Testing Based Development)",
      "Why do we need to test our code?",
      "React Testing Library",
      "Folder structure and extension of test files",
      "How to write test files?",
      "render and get methods",
      "expect method",
      "What is Cypress?",
      "How is it different from RTL?",
      "Process of creating and running a basic cypress test",
      "Learning how to create test cases using counter example",
      "Testing application created by someone else using todo example (https://example.cypress.io/todo)",
    ],
  },
  node: {
    job_title: "Backend Software Developer",
    topics: [
      "Nodejs Basics",
      "JS",
      "JWT",
      "Mongoose and Mongodb",
      "Express",
      "Middlewares in Express",
      "WebSockets",
      "Basic of Caching with Redis",
      "SQL",
      "OOPs",
      "SOLID",
      "Arrays",
      "Strings",
      "Stack",
      "Queue",
      "Linked List",
    ],
  },
  java: {
    job_title: "Backend Software Developer",
    topics: [
      "Core Java",
      "Object-Oriented Programming (OOP) concepts",
      "Java Collections Framework",
      "Exception Handling",
      "Multithreading and Concurrency",
      "Java I/O (Input/Output)",
      "Generics",
      "Lambda Expressions",
      "Java Streams",
      "Java Annotations",
      "Java Reflection",
      "Java Serialization",
      "Java JDBC (Java Database Connectivity)",
      "Spring Framework",
      "Dependency Injection (DI) in Spring",
      "Inversion of Control (IoC) in Spring",
      "Spring Boot",
      "Spring Boot Starter",
      "Spring Boot Autoconfiguration",
      "Spring Boot Actuator",
      "Spring Boot Data JPA",
      "Spring Boot RESTful Web Services",
      "Spring Security",
      "Spring Boot Testing",
      "Spring Boot DevTools",
      "Spring Boot Validation",
      "Spring Boot Error Handling",
      "Spring Boot Caching",
      "Spring Boot Actuator",
      "Spring Boot Profiles",
      "Spring Boot Configuration Properties",
      "Spring Boot Logging",
      "Spring Boot Dockerization",
      "Spring Boot Deployment",
      "Spring Boot Integration with Frontend (e.g., React, Angular)",
      "RESTful API Design Principles",
      "API Documentation with Swagger",
      "Spring Data MongoDB",
      "Spring Data JPA",
      "Spring Data Redis",
      "Spring Cloud (Microservices with Spring Boot)",
      "Spring Security",
      "Spring AOP (Aspect-Oriented Programming)",
      "Testing with JUnit and Mockito",
      "Database Design and SQL",
      "MySQL or PostgreSQL",
      "NoSQL Databases (MongoDB, Redis)",
      "Caching Strategies and Redis",
      "HTTP and REST Concepts",
      "JSON Web Tokens (JWT)",
      "Version Control with Git",
      "Build Tools (Maven, Gradle)",
      "Deployment (Docker, Kubernetes)",
      "Continuous Integration and Continuous Deployment (CI/CD)",
      "Design Patterns (e.g., Singleton, Factory, MVC)",
      "Performance Optimization and Monitoring",
      "Security Best Practices in Java",
      "Code Quality and Code Review",
      "Software Design Principles (e.g., SOLID)",
      "API Security and Authentication",
    ],
  },
};

const HomePage: React.FC = () => {
  const [selectedInterviewType, setSelectedInterviewType] =
    useState<string>("");
  const [questionList, setQuestionList] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [interviewerResponse, setInterviewerResponse] = useState<string>("");

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "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";

  const generate = async (message: string) => {
    try {
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
      });

      const data = await response.json();
      console.log(data);
      setInterviewerResponse(data.choices[0].message.content);
      setUserAnswer("");

      // Read the response as a stream of data
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      setInterviewerResponse("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // Massage and parse the chunk of data
        const chunk = decoder.decode(value);
        const lines = chunk.split("\\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
          .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
          .map((line) => JSON.parse(line)); // Parse the JSON string

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          // Update the UI with the new content
          if (content) {
            setInterviewerResponse(interviewerResponse + content);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setInterviewerResponse("Error occurred while generating.");
    }
  };

  const handleStartInterview = async () => {
    if (!selectedInterviewType) return;

    const prompt = `I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position of ${
      courseData[selectedInterviewType].job_title
    }.
        
    I want you to only reply as the interviewer. Do not write all the conservation at once. I want you to only do the technical interview with me on coding ( Topics : ${courseData[
      selectedInterviewType
    ].topics.join(
      ", "
    )}) and data structures and algorithms ( Topics : Arrays, Strings, Stack, Queue, linked list ). Ask me the questions and wait for my answers. Start the interview now and Ask only one question at a time, if I am not able to answer satisfactorily, give me feedback in this framework:
    
    ####
    If it is a Data Structures and Algorithms or a coding technical question then
    REACTO: 
    R: Repeat (Repeating the question in your own word)
    E: Examples (Give some examples to clear out the meaning) and edge cases
    A: Approach (Discussing the approach to solve the question)
    C: Code (Writing the code with proper indentation, commenting and proper coding format)
    T: Testing the code (With some own test cases)
    O: Optimise (Use optimisation to optimise the already present code)
    ---
    If it is a Conceptual question then
    D: Definition
    U: Use-case
    B: Benefit
    X: Extra Information
    ---
    #####
    {<Ask me the questions individually like an interviewer and wait for my answers. Do not ask more than one question at a time >}
    Questions can include both new questions and follow up questions from the previous questions. Continue the process until I ask you to stop.  And, you will stop the interview when I tell you to stop using the phrase “stop the interview”. After that, you would provide me feedback. 
    
    The cumulative feedback generated at the end should be evaluated using the following rubrics. While grading my responses you have to very strict like a real interviewer
    1. Subject Matter Expertise
    2. Communication skills
    3. Problem Solving skills
    4. Hiring criteria : Options are Reject, Waitlist, Hire and Strong Hire
    5. Code Quality
    Feedback for Subject Matter Expertise, Communication skills, Problem Solving skills should contain ratings on my interview responses from 0 - 10`;

    generate(prompt);
  };

  const handleStopInterview = async () => {
    generate("stop the interview");
  };

  const handleAnswerSubmission = async () => {
    if (userAnswer == "") return;
    generate(userAnswer);
  };

  const handleNextQuestion = async () => {
    generate("next question");
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
          <button
            onClick={handleStopInterview}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Stop Interview
          </button>
        </div>
      </div>

      {/* <div className="QandA">
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{questionList[currentQuestionIndex]} questionList</p>
      </div>

      <div className="feedback">
        <p>Feedback:</p>
        <p>{interviewerResponse}</p>
      </div> */}

      <div className="resultContainer">
        <p>Interviewer: {interviewerResponse}</p>
      </div>

      <div
        // style={{ backgroundColor: "#f0f0f0" }}
        className="inputSection flex justify-center items-center fixed bottom-0 left-0 w-full p-4"
      >
        <div className="flex-grow">
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="promptInput"
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
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNextQuestion}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default HomePage;
