import EmployeeList from "./components/employees";
import MyEmployees from "./components/myEmployees";
// import CoinAPI from "./components/coin";
// import Todos from "./components/todo";

export default function Home() {
  return (
    <div className="flex h-screen w-screen p-10 bg-gray-600 gap-10">
      {/* ======================for employee API example ================= */}
      <MyEmployees />
      <EmployeeList apiEndpoint="https://dummyjson.com/users" />
      {/* ToDos API example */}
      {/* <Todos /> */}
      {/* ======================for bitcoin API example ================= */}
      {/* <CoinAPI /> */}
    </div>
  );
}
