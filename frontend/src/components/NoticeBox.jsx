import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { url, viewNotice } from "../api.js";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const getCategories = (notices) => {
  const cats = new Set();
  notices.forEach((n) => {
    if (n.category && typeof n.category === "string") cats.add(n.category);
  });
  return ["All", ...Array.from(cats)];
};

const NOTICES_PER_PAGE = 5;

const NoticeBox = () => {
  const [notices, setNotices] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // map notices for frontend
  const NOTICE_PREVIEW_LENGTH = 80;
  const mapNotices = (data) =>
    data.map((n) => {
      const dateObj = new Date(n.createdAt);
      return {
        id: n.id,
        title: n.title,
        short:
          n.content.length > NOTICE_PREVIEW_LENGTH
            ? n.content.slice(0, NOTICE_PREVIEW_LENGTH) + "..."
            : n.content,
        full: n.content,
        category: n.category || "General",
        date: dateObj.toLocaleDateString(),
        time: dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        attachments: n.attachments || [],
      };
    });

  // Fetch notices from backend on each refresh
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await viewNotice(); // assuming this returns the array
        const mapped = mapNotices(data);
        setNotices(mapped);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //making notice groups, notices with no category will go to General
  const validNotices = notices.filter(
    (n) => n && n.id && n.title && n.short && n.full && n.category
  );
  const tabs = getCategories(validNotices);

  //filter the notices based on the current selected tab
  const filteredNotices =
    selectedTab === "All"
      ? validNotices
      : validNotices.filter((n) => n.category === selectedTab);

  //calc number of pages for each tab
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotices.length / NOTICES_PER_PAGE)
  );

  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * NOTICES_PER_PAGE,
    currentPage * NOTICES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [selectedTab]);

  useEffect(() => {
    setExpandedId(null);
  }, [currentPage]);

  //handle expansion of notices
  const [isHiddenId, setIsHiddenId] = useState(null);
  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setIsHiddenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-52 py-6 text-white scrollbar-hide">
      {/* Tabs */}
      <div className="flex gap-6 text-lg border-b border-gray-600 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 ${
              selectedTab === tab
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 text-xl gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-yellow-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &laquo;
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={`px-1 ${
              currentPage === page + 1
                ? "text-yellow-400 font-semibold"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="text-yellow-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &raquo;
        </button>
      </div>

      {/* Notices */}
      <div className="space-y-6 mt-6">
        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading notices...
          </div>
        )}
        {!loading && currentNotices.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No notices found.
          </div>
        )}
        {currentNotices.map((notice) => (
          <div key={notice.id}>
            {/* Summary */}
            <button
              onClick={() => handleExpand(notice.id)}
              className="w-full text-left flex rounded-[10px] p-5 gap-10 justify-start items-stretch bg-gradient-to-r from-[#1E1E1E] to-black transition
                hover:bg-gradient-to-r hover:from-yellow-900/40 hover:to-yellow-900/20 hover:scale-[1.015] hover:shadow-lg"
              hidden={isHiddenId === notice.id}
            >
              {/* Date/time */}
              <div className="flex flex-col items-center justify-center py-2 gap-2 border-r-2 border-yellow-500 w-30 min-w-0 text-yellow-400 text-center">
                <div className="text-base font-semibold">{notice.date}</div>
                <div className="text-xs font-semibold mt-1">{notice.time}</div>
              </div>

              {/* Summary */}
              <div className="flex-1">
                <div className="text-xl font-semibold my-2">{notice.title}</div>
                <p className="text-gray-300 text-sm mt-1">
                  {parse(DOMPurify.sanitize(notice.short))}
                </p>
              </div>
            </button>

            {/* Expanded */}
            {expandedId === notice.id && (
              <div onClick={() => handleExpand(null)}>
                <div className="mt-3 border border-yellow-500/90 rounded-[10px]  bg-gradient-to-r from-[#1E1E1E] to-black p-10 flex gap-5">
                  <div className="flex-col w-auto gap-10 flex-1">
                    <div className="text-2xl font-bold mb-2">
                      {notice.title}
                    </div>
                    <div className="whitespace-pre-line text-gray-300">
                      {parse(notice.full)}
                    </div>
                  </div>
                  <div className="w-28 border-l-2 border-yellow-500 pl-3 space-y-3 flex-shrink-">
                    <div className="text-sm text-white font-semibold">
                      {notice.time} {notice.date}
                    </div>
                    {/* {notice.attachments?.length > 0 && (
                      <div>
                        <div className="text-yellow-400 font-semibold mb-2">
                          Attachments
                        </div>
                        {notice.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
                          >
                            <FaDownload className="text-sm" />
                            {file.filename}
                          </a>
                        ))}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBox;
