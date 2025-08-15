import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { url, viewNotice } from "../api.js";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const NOTICES_PER_PAGE = 5;
const NOTICE_PREVIEW_LENGTH = 80;

// notices mapping for looping on each notice element
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

// category helper function
const getCategories = (notices) => {
  const cats = new Set();
  notices.forEach((n) => {
    if (n.category && typeof n.category === "string") cats.add(n.category);
  });
  return ["All", ...Array.from(cats)];
};

//animation variation objects
const summaryItemVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};
const expandedVariant = {
  hidden: { opacity: 0, scale: 0.995 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.995 },
};

export default function NoticeBox() {
  const [notices, setNotices] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  //fetching notice data with mount guard to avoid memory leaks and react bugs
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await viewNotice();
        if (!mounted) return;
        setNotices(mapNotices(data));
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  //validation and derived values settings
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

  // hook for setting current page and default expanded id on changing category tabs
  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [selectedTab]);

  // setting expanded if on each current page number change
  useEffect(() => {
    setExpandedId(null);
  }, [currentPage]);

  // expansion id logic to close the previous one and open the new one
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    // scrollable noticebox list as the main container
    <div className="w-full h-full overflow-y-auto px-4 md:px-52 py-6 text-white scrollbar-hide">
      {/* Tabs  section to view and fetch all the different category tabs*/}
      <div className="flex gap-6 text-lg border-b border-gray-600 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 transition-colors duration-200 focus:outline-none rounded-sm ${
              selectedTab === tab
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pagination controls, prev number s next... */}
      <div className="flex justify-end items-center mt-6 text-xl gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="text-yellow-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          &laquo; {/* << html entity*/}
        </button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={`px-1 transition-colors duration-150 ${
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
          &raquo; {/* >> html entity*/}
        </button>
      </div>

      {/* Notices container */}
      <div className="space-y-6 mt-6">
        {/* loading notices screen */}
        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading notices...
          </div>
        )}

        {/* empty notice list */}
        {!loading && currentNotices.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No notices found.
          </div>
        )}

        {/* Animation wrapper for the notices, iterates over the currentNotices */}
        <AnimatePresence initial={false} mode="popLayout">
          {currentNotices.map((notice) => {
            const isExpanded = expandedId === notice.id;
            return (
              <motion.div
                key={notice.id}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={summaryItemVariant}
                transition={{ duration: 0.25 }}
              >
                {/* Summary (collapsed) */}
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.button
                      layout
                      onClick={() => toggleExpand(notice.id)}
                      className="w-full text-left flex rounded-[12px] p-5 gap-6 justify-start items-stretch bg-gradient-to-r from-[#111111] to-[#000000] transition transform hover:scale-[1.01] hover:shadow-2xl hover:from-yellow-900/30 hover:to-yellow-900/10 focus:outline-none focus:ring-4 focus:ring-yellow-400/10 backdrop-blur-sm"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.995 }}
                      aria-expanded={false}
                    >
                      <div className="flex flex-col items-center justify-center py-2 gap-2 border-r-2 border-yellow-500 w-30 min-w-0 text-yellow-400 text-center">
                        <div className="text-base font-semibold">
                          {notice.date}
                        </div>
                        <div className="text-xs font-semibold mt-1">
                          {notice.time}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="text-xl font-semibold my-2">
                          {notice.title}
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          {parse(DOMPurify.sanitize(notice.short))}
                        </p>
                      </div>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="flex items-center gap-3">
                          <FaDownload className="text-yellow-400" />
                        </div>
                      )}
                    </motion.button>
                  )}

                  {/* Expanded */}
                  {isExpanded && (
                    <motion.div
                      layout
                      layoutId={`notice-${notice.id}`}
                      onClick={() => toggleExpand(notice.id)}
                      className="mt-3 border border-yellow-500/90 rounded-[12px] bg-gradient-to-r from-[#0f0f0f] to-[#000000] p-8 flex gap-5 transform origin-top shadow-2xl backdrop-blur-md cursor-pointer"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={expandedVariant}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 120,
                      }}
                    >
                      <div className="flex-col w-auto gap-6 flex-1">
                        <div className="text-2xl font-bold mb-2">
                          {notice.title}
                        </div>
                        <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                          {parse(notice.full)}
                        </div>

                        {/* attachments - rendered inline */}
                        {notice.attachments &&
                          notice.attachments.length > 0 && (
                            <div className="mt-4 flex gap-3 items-center">
                              {notice.attachments.map((a, idx) => (
                                <a
                                  key={idx}
                                  href={a.url || "#"}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-sm text-yellow-300 hover:underline"
                                >
                                  <FaDownload />{" "}
                                  {a.name || `Attachment ${idx + 1}`}
                                </a>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="w-28 border-l-2 border-yellow-500 pl-3 space-y-3 flex-shrink-0 text-right">
                        <div className="text-sm text-white font-semibold">
                          {notice.time}
                        </div>
                        <div className="text-xs text-gray-400">
                          {notice.date}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
