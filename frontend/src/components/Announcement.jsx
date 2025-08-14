import announcementIcon from "../assets/announcement.png";

function Announcement() {
  return (
    <div className="flex justify-center items-center py-4 w-full">
      {/* <img src={announcementIcon} alt="Announcement" className="w-24 h-20" /> */}
      <div className="text-white text-5xl font-black px-4 py-2">
        Technology Noticeboard
        {/* <input
          type="text"
          placeholder="Search announcements..."
          className="text-black px-2 py-0.5 rounded bg-white"
        /> */}
      </div>
    </div>
  );
}

export default Announcement;
