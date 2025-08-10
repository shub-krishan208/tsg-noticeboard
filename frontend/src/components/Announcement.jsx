import announcementIcon from '../assets/announcement.png';

function Announcement() {
  return (
    <div className="flex justify-center items-center py-4 w-full">
      <img src={announcementIcon} alt="Announcement" className="w-24 h-20" />
      <div className="text-white text-lg px-4 py-2">
        <h3 className="mb-1">Announcements</h3>
        <input
          type="text"
          placeholder="Search announcements..."
          className="text-black px-2 py-0.5 rounded bg-white"
        />
      </div>
    </div>
  );
}

export default Announcement;
