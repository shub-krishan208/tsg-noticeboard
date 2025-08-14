import { useNavigate } from "react-router-dom";
import gymkhanaLogo from "../assets/gymkhanaLogo.png";

const Header = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/"); // redirect to home page after logout
  };

  return (
    <header className="bg-black flex justify-between items-center">
      <div className="flex items-center gap-1 px-8 py-4">
        <img src={gymkhanaLogo} alt="Gymkhana Logo" className="w-7 h-7" />
        <span className="text-white text-lg">TSG</span>
      </div>
      <div className="flex items-center gap-8 text-white px-10 py-4 text-base"></div>
    </header>
  );
};

export default Header;
