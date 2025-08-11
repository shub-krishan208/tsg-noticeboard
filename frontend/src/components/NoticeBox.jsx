import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { url } from "../api.js";

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

  // Fetch notices from backend
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const res = await fetch(url.dev.notices);
        if (!res.ok) throw new Error("Failed to load notices");
        const data = await res.json();

        // Map DB fields to UI format
        const mapped = data.map((n) => ({
          id: n.id,
          title: n.title,
          short:
            n.content.length > 120
              ? n.content.slice(0, 120) + "..."
              : n.content,
          full: n.content,
          category: n.category || "General",
          date: new Date(n.createdAt).toLocaleDateString(),
          time: new Date(n.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          attachments: n.attachments || [], // If you add this to DB later
        }));

        setNotices(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const validNotices = notices.filter(
    (n) => n && n.id && n.title && n.short && n.full && n.category
  );
  const tabs = getCategories(validNotices);

  const filteredNotices =
    selectedTab === "All"
      ? validNotices
      : validNotices.filter((n) => n.category === selectedTab);

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

  const handleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
              className="w-full text-left flex bg-black border border-yellow-400 rounded p-4 justify-between items-start hover:bg-gray-700 transition"
              style={{
                borderWidth: "2px",
                borderStyle: "solid",
                borderImageSlice: 1,
                borderImageSource:
                  "linear-gradient(to right, #facc15, #000000)",
              }}
            >
              <div className="w-1/4 text-center text-yellow-400 text-sm">
                <div>{notice.date}</div>
                <div>{notice.time}</div>
              </div>
              <div className="w-3/4">
                <div className="text-lg font-semibold">{notice.title}</div>
                <p className="text-gray-300 text-sm mt-1">{notice.short}</p>
              </div>
            </button>

            {/* Expanded */}
            {expandedId === notice.id && (
              <div
                className="mt-3 border border-yellow-400 bg-black p-6 flex flex-col md:flex-row gap-6"
                style={{
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(to right, #facc15, #000000)",
                }}
              >
                <div className="md:w-3/4">
                  <h2 className="text-xl font-bold mb-2">{notice.title}</h2>
                  <div className="whitespace-pre-line text-gray-300">
                    {notice.full}
                  </div>
                </div>

                <div className="md:w-1/4 space-y-3">
                  <div className="text-sm text-gray-400">
                    {notice.time} {notice.date}
                  </div>

                  {notice.attachments?.length > 0 && (
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
                  )}
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
