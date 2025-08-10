import gymkhanaLogo from "../assets/gymkhanaLogo.png";

const Header = ({ onLoginClick }) => {
  return (
    <header className="bg-black flex justify-between">
      <div className="flex items-center gap-1 px-8 py-4">
        <img src={gymkhanaLogo} alt="Gymkhana Logo" className="w-7 h-7" />
        <span className="text-white text-lg">TSG</span>
      </div>
      <div className="flex items-center gap-8 text-white px-10 py-4 text-base">
        <div className="text-yellow-400 cursor-pointer">Homepage</div>
        <div
          onClick={onLoginClick}
          className="bg-yellow-400 text-black px-8 py-1 rounded-xl cursor-pointer"
        >
          Login
        </div>
      </div>
    </header>
  );
};

export default Header;
