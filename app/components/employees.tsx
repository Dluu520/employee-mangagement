"use client";
import { useState, useEffect } from "react";

// Define the Employee interface
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
}

// Define the props for the component
interface EmployeeListProps {
  apiEndpoint: string;
}

const EmployeeList = ({ apiEndpoint }: EmployeeListProps) => {
  // State declarations with proper typing
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [newEmployee, setNewEmployee] = useState({
  //   id: "",
  //   firstName: "",
  //   lastName: "",
  //   position: "",
  //   department: "",
  // });

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        // Transform the API response to match the Employee interface
        const formattedEmployees: Employee[] = data.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          position: "Employee", // Mock position
          department: user.company.department,
        }));
        setEmployees(formattedEmployees);
        setFilteredEmployees(formattedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [apiEndpoint]);

  // Handle search/filter
  useEffect(() => {
    const filtered = employees.filter(
      employee =>
        employee.id.toString().includes(searchTerm) ||
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-[800px] h-[600px] shadow-black">
      {/* Search Bar */}
      <h1>Dummyjson public API endpoint</h1>
      <input
        type="text"
        placeholder="Search by ID, Name, Position, or Department"
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
              <th className="p-2 text-left">First Name</th>
              <th className="p-2 text-left">Last Name</th>
              <th className="p-2 text-left">Position</th>
              <th className="p-2 text-left">Department</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id} className="border-b">
                <td className="p-2">{employee.id}</td>
                <td className="p-2">{employee.firstName}</td>
                <td className="p-2">{employee.lastName}</td>
                <td className="p-2">{employee.position}</td>
                <td className="p-2">{employee.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
