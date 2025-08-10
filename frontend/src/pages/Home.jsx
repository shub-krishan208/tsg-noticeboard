import Header from "../components/Header";
import Body from "../components/Body";

const Home = ({ onLoginClick }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header onLoginClick={onLoginClick} />
      <Body />  
    </div>
  );
}

export default Home;
