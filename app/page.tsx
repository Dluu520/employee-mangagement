"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Base API URLs for various requests
const baseUrl = "https://jsonplaceholder.typicode.com";
const bitCoinURL = "https://api.coindesk.com/v1/bpi/currentprice.json";
const myEmployee = "http://localhost:3000/api/users";

// TypeScript interfaces for type safety
interface Post {
  id: number;
  title: string;
}

interface Coin {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  bpi: {
    USD: {
      rate: string;
    };
  };
  disclaimer: string;
}

interface Employee {
  _id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [posts, setPost] = useState<Post[]>([]);
  const [coins, setCoins] = useState<Coin>();

  // useEffect fetches API data for employees, posts, and coins (currently commented out)
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`${baseUrl}/todos`);
  //       const data = (await response.json()) as Post[];
  //       setPost(data);
  //       const coinRes = await fetch(`${bitCoinURL}`);
  //       const coinData = (await coinRes.json()) as Coin;
  //       setCoins(coinData);
  //     } catch (e: any) {
  //       setError(e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  // if (error) {
  //   console.error(error);
  //   return <div>An error occurred: {error}</div>;
  // }

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="flex flex-col gap-10 p-20 overflow-hidden">
        {/* ======================for employee API example ================= */}
        <MyEmployees />
        {/* ToDos API example */}
        <Todos />
        {/* ======================for bitcoin API example ================= */}
        <CoinAPI />
      </div>
    </div>
  );
}

// This component fetches and displays a list of todos
function Todos() {
  const [todos, setTodos] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Fetch the todo items
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/todos`);
        const data = (await response.json()) as Post[];
        setTodos(data);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <div>Todo List</div>
      {isLoading ? (
        <div className="flex h-screen p-20">loading data....</div>
      ) : (
        <ul className="h-full w-full overflow-scroll list-disc pl-5 border border-black ">
          {todos.map((post) => {
            return (
              <li className="" key={post.id}>
                {post.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// This component fetches and displays the current Bitcoin rate
function CoinAPI() {
  const [coins, setCoins] = useState<Coin>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Fetch the coin data
  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const coinRes = await fetch(`${bitCoinURL}`);
        const coinData = (await coinRes.json()) as Coin;
        setCoins(coinData);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoins();
  }, []);

  return (
    <div>
      <div>Coin List</div>
      {/* Display Bitcoin rate */}
      <div className="border border-black">
        Coin rate: {coins?.bpi.USD.rate}
      </div>
    </div>
  );
}

// This component manages employee data, with functions to add, delete, and update employees
function MyEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch the employees' data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const employeeRes = await fetch(`${myEmployee}`);
        const employeeData = (await employeeRes.json()) as Employee[];
        setEmployees(employeeData);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle the form submission to add a new employee
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEmployee = { email, username, password };
    try {
      const res = await fetch(`${myEmployee}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!res.ok) {
        console.error("Error submitting data");
        return;
      }

      console.log("Successfully submitted");

      // Fetch the updated list of employees
      const updatedEmployees = await fetch(`${myEmployee}`).then((res) =>
        res.json()
      );

      // Update the state with the new list and visually refresh the component
      setEmployees(updatedEmployees);

      // Clear form fields
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Catch error: ", err);
    }
  };

  // Handle employee deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`${myEmployee}?userId=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete employee");
        return;
      }

      // Remove the deleted employee from the state
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );

      console.log(`Employee with ID ${id} deleted successfully`);
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  // Handle edit button click
  const handleEditClick = (employee: Employee) => {
    setEditEmployee(employee);
    setNewEmail(employee.email);
    setNewUsername(employee.username);
    setNewPassword(employee.password);
  };

  // Handle form submission for updating employee details
  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editEmployee) {
      const updatedEmployee = {
        userId: editEmployee._id,
        newUserName: newUsername,
        newUserEmail: newEmail,
        newUserPassword: newPassword,
      };

      try {
        const response = await fetch(`${myEmployee}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        });

        if (!response.ok) {
          console.error("Error updating employee:", response.statusText);
          return;
        }

        const data = await response.json();
        if (data.message === "user is updated") {
          setEmployees(
            employees.map((employee) =>
              employee._id === editEmployee._id
                ? {
                    ...employee,
                    username: newUsername,
                    email: newEmail,
                    password: newPassword,
                  }
                : employee
            )
          );
          setEditEmployee(null); // Close the edit form
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    }
  };

  return (
    <div className="flex max-h-[300px] w-full flex-col">
      {/* Form to add a new employee */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add Employee</button>
      </form>

      <div>Employees List</div>
      {isLoading ? (
        <div className="flex h-screen p-20">loading data....</div>
      ) : (
        <div className="grid gap-2 h-full w-full max-w-full overflow-y-scroll scroll-snap-type-y-mandatory border border-black p-2">
          {/* Render list of employees */}
          {employees.map((employee) => {
            return (
              <div
                className="grid grid-cols-7 border min-h-[150px] border-black rounded-lg p-2 scroll-snap-align-start"
                key={employee._id}
              >
                <div className="border border-black text-center p-2 break-words">
                  ID: {employee._id}
                </div>
                <div className="border border-black text-center p-2 break-words">
                  Email: {employee.email}
                </div>
                <div className="border border-black text-center p-2 break-words">
                  Username: {employee.username}
                </div>
                <div className="border border-black text-center p-2 break-words">
                  Password: {employee.password}
                </div>
                <div className="border border-black text-center p-2 break-words">
                  Created At: {employee.createdAt.toLocaleString()}
                </div>
                <div className="border border-black text-center p-2 break-words">
                  Updated At: {employee.updatedAt.toLocaleString()}
                </div>
                <div className="flex flex-col h-full max-h-full">
                  {/* Delete and Update buttons */}
                  <button
                    className="bg-red-500 text-white p-2 w-full h-full"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 w-full h-full"
                    onClick={() => handleEditClick(employee)}
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}

          {/* Edit Employee form */}
          {editEmployee && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold">Edit Employee</h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="my-4">
                    <label className="block mb-2">Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="my-4">
                    <label className="block mb-2">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="my-4">
                    <label className="block mb-2">Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
                <button
                  className="mt-2 bg-gray-500 text-white p-2 rounded w-full"
                  onClick={() => setEditEmployee(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
