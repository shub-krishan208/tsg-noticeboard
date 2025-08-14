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
      <div className="flex items-center gap-8 text-white px-10 py-4 text-base">
<<<<<<< HEAD
        <div
          className="text-yellow-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Homepage
        </div>
        <div
          className="text-yellow-400 cursor-pointer"
          onClick={() => navigate("/publish")}
        >
          Publish
        </div>
        <div
          onClick={onLoginClick}
          className="bg-yellow-400 text-black px-8 py-1 rounded-xl cursor-pointer"
        >
          Login
=======
        <div className="text-yellow-400 cursor-pointer" onClick={() => navigate("/")}>
          Homepage
>>>>>>> frontend
        </div>

        {token ? (
          <div className="flex items-center gap-4">
            <div className="text-gray-300 text-sm text-right">
              <div>{username}</div>
              <div className="text-gray-400 text-xs">{email}</div>
            </div>
            <div
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-[8px] cursor-pointer"
            >
              Logout
            </div>
          </div>
        ) : (
          <div
            onClick={onLoginClick}
            className="bg-yellow-400 text-black px-8 py-1 rounded-[8px] cursor-pointer"
          >
            Login
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
