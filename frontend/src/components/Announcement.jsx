import announcementIcon from "../assets/announcement.png";

function Announcement() {
  return (
    <div className="flex justify-center items-center py-4 w-full bg-auto">
      {/* <img src={announcementIcon} alt="Announcement" className="w-24 h-20" /> */}
      <div className="text-white text-2xl px-4 py-2">
        <h3 className="mb-1">Announcements</h3>
        {/* //removed search field  */}
      </div>
    </div>
  );
}

export default Announcement;
