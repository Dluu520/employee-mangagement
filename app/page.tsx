"use client";
import Link from "next/link";
import MyEmployees from "./components/myEmployees";
import EmployeeList from "./components/employees";
// import CoinAPI from "./components/coin";
// import Todos from "./components/todo";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const Home: React.FC = () => {
  const [showComponentA, setShowComponentA] = useState<boolean>(true);

  // Function to toggle between components
  const toggleComponent = () => {
    setShowComponentA((prev) => !prev);
  };
  return (
    <div className="flex flex-col min-h-screen p-10 bg-blue-950 gap-10">
      {/* Button to toggle between components */}
      <button
        onClick={toggleComponent}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
      >
        {showComponentA
          ? "Switch to sample employee list"
          : "Switch to CRUD example"}
      </button>{" "}
      <div className="mb-8">
        {/* Use AnimatePresence to handle exit animations */}
        <AnimatePresence mode="wait">
          {showComponentA ? (
            <MyEmployees key="A" />
          ) : (
            <EmployeeList apiEndpoint="https://dummyjson.com/users" key="B" />
          )}
        </AnimatePresence>
      </div>
      {/* <div className="text-white ">
        <Link
          className="bg-cyan-800 hover:bg-cyan-400 p-4 "
          href="/EmployeeList"
        >
          Switch To Sample Employee List Management Simulator
        </Link>
      </div> */}
      {/* <h1 className="text-white">Employee List Management System Simulator</h1> */}
      {/* ======================for employee API example ================= */}
      {/* <MyEmployees />
      <EmployeeList apiEndpoint="https://dummyjson.com/users" /> */}
      {/* ToDos API example */}
      {/* <Todos /> */}
      {/* ======================for bitcoin API example ================= */}
      {/* <CoinAPI /> */}
    </div>
  );
};
export default Home;
