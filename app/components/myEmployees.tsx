"use client";
import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
// This component manages employee data, with functions to add, delete, and update employees
const MyEmployees = () => {
  // Development purpose API
  // const myEmployee = "http://localhost:3000/api/users"; // Your MongoDB endpoint
  const myEmployee =
    "https://employees-restful-api-example.vercel.app/api/users";
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from MongoDB
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(myEmployee);
        const data = await response.json();
        console.log("API Response:", data); // Log the response
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handle search/filter
  useEffect(() => {
    const filtered = employees.filter(
      employee =>
        employee?._id?.toString().includes(searchTerm) ||
        employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // Handle input change for new employee
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Handle form submission for adding a new employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(myEmployee, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        alert(
          "Failed to add employee. The email, and or username listed had aready been registered."
        );
        throw new Error("Failed to add employee");
      }

      const data = await response.json();
      console.log("API Response after adding employee:", data);

      // Update state with the new employee
      setEmployees(prevEmployees => [...prevEmployees, data]);
      setFilteredEmployees(prevEmployees => [...prevEmployees, data]);

      // Close the modal and reset the form
      setIsModalOpen(false);
      setNewEmployee({ email: "", username: "", password: "" });

      // Re-fetch employees to ensure the component reflects the latest data
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(myEmployee);
          const data = await response.json();
          setEmployees(data);
          setFilteredEmployees(data);
        } catch (err) {
          setError("Failed to fetch employees");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      await fetchEmployees();
    } catch (err) {
      setError("Failed to add employee");
      console.error(err);
    }
  };

  // Handle employee deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`${myEmployee}?userId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees(employees.filter(employee => employee._id !== id));
      setFilteredEmployees(
        filteredEmployees.filter(employee => employee._id !== id)
      );
    } catch (err) {
      setError("Failed to delete employee");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-[800px] h-[600px] shadow-black">
      {/* Search Bar */}
      <h1>MongoDB API endpoint</h1>
      <input
        type="text"
        placeholder="Search by ID, Email, or Username"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Employee Table */}
      <div className="overflow-y-auto flex-grow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Password</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Updated At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{employee._id}</td>
                <td className="p-2">{employee.email}</td>
                <td className="p-2">{employee.username}</td>
                <td className="p-2">{employee.password}</td>
                <td className="p-2">
                  {new Date(employee.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {new Date(employee.updatedAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Employee
      </button>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading and Error Messages */}
      {isLoading && <div className="mt-4 text-center">Loading...</div>}
      {error && <div className="mt-4 text-center text-red-500">{error}</div>}
    </div>
  );
};

export default MyEmployees;
