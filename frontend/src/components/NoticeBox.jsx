import React, { useState, useEffect } from 'react';
import noticesData from '../data/notices.json';
import { FaDownload } from 'react-icons/fa';

const tabs = ['All', 'Tech', 'Acad', 'Welfare'];
const NOTICES_PER_PAGE = 5;

const NoticeBox = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const filteredNotices = selectedTab === 'All'
    ? noticesData
    : noticesData.filter(n => n.category === selectedTab);

  const totalPages = Math.ceil(filteredNotices.length / NOTICES_PER_PAGE);

  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * NOTICES_PER_PAGE,
    currentPage * NOTICES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setExpandedId(null);
  }, [selectedTab]);

  const handleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-52 py-6 text-white scrollbar-hide">
      <div >
      {/* Tabs */}
        <div className="flex gap-6 text-lg border-b border-gray-600 mb-4">
            {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-2 ${
                selectedTab === tab
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
            >
                {tab}
            </button>
            ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-end items-center mt-6 text-xl gap-2">
            <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-yellow-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
            >
            &laquo;
            </button>
            {[...Array(totalPages).keys()].map(page => (
            <button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-1 ${
                currentPage === page + 1
                    ? 'text-yellow-400 font-semibold'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
            >
                {page + 1}
            </button>
            ))}
            <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-yellow-400 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
            >
            &raquo;
            </button>
       </div>
      </div>

      {/* Notices */}
      <div className="space-y-6">
        {currentNotices.map(notice => (
          <div key={notice.id}>
            {/* Summary Box */}
            <button
              onClick={() => handleExpand(notice.id)}
              className="w-full text-left flex bg-black border border-yellow-400 rounded p-4 justify-between items-start hover:bg-gray-700 transition"
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

            {/* Expanded Box */}
            {expandedId === notice.id && (
              <div className="mt-3 border border-yellow-400 bg-black p-6 flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4">
                  <h2 className="text-xl font-bold mb-2">{notice.title}</h2>
                  <div className="whitespace-pre-line text-gray-300">{notice.full}</div>
                </div>

                <div className="md:w-1/4 space-y-3">
                  <div className="text-sm text-gray-400">
                    {notice.time} {notice.date}
                  </div>

                  {notice.attachments?.length > 0 && (
                    <div>
                      <div className="text-yellow-400 font-semibold mb-2">Attachments</div>
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
