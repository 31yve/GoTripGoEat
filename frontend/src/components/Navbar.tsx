import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="p-4 flex justify-between bg-gray-100">
      <h1 className="font-bold">GoTripGoEat</h1>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
