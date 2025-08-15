import Announcement from "./Announcement";
import NoticeBox from "./NoticeBox";
import Footer from "./Footer";
import bgImage from "../assets/bgImage.png";
import Header from "./Header";

const Body = () => {
  return (
    <div
      className="overflow-hidden flex flex-col items-center w-full h-screen bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header />
      <div className="bg-black/80 w-full h-full flex flex-col">
        {/* Fixed height header */}
        <div className="h-[100px] flex-shrink-0">
          <Announcement />
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          <NoticeBox />
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Body;
