import React, { useState } from 'react';
import Header from '../components/Header';

const PaperclipIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
);

export default function Publish() {
  // State management for form fields
  const [announcementType, setAnnouncementType] = useState('Tech');
  const [publishOn, setPublishOn] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [message, setMessage] = useState('');


  // checking if the user if logged in
  if (!localStorage.getItem('authToken')) {
    return (
      <div className="bg-black text-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to publish announcements</h1>
          <p className="text-gray-400">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }
  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };
  
  // Handle form submission
  const handlePublish = (e) => {
    e.preventDefault(); // Prevent default form submission which reloads the page

    // Basic validation
    if (!title || !body || !publishOn) {
        setMessage('Please fill in Title, Body, and Publish On date.');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        return;
    }

    // Create the notice object from the form state
    const noticeData = {
      announcementType,
      publishOn,
      title,
      body,
      attachmentName: attachment ? attachment.name : null,
      author: currentUser,
      publishedAt: new Date().toISOString(),
    };

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(noticeData, null, 2); // `null, 2` formats the JSON nicely

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notice.json'; // The default filename for the downloaded file
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the temporary anchor and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage('Announcement JSON file has been generated and downloaded!');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans flex flex-col">
      {/* Header Section */}
      <Header/>
      
      <div className="text-2xl font-semibold text-center mt-5">Publish a <span className="text-yellow-500">new</span> announcemnt</div>

      {/* Main Content: Form */}
      <main className="flex-grow p-4 md:p-8 flex items-center justify-center">
        <form onSubmit={handlePublish} className="w-full max-w-4xl bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl shadow-black/30 space-y-6">
          
          {/* Form Header: Type and Date */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Announcement Type */}
            <div className="flex-1">
              <label htmlFor="announcement-type" className="block text-sm font-medium text-gray-400 mb-2">Announcement Type</label>
              <select 
                id="announcement-type"
                value={announcementType}
                onChange={(e) => setAnnouncementType(e.target.value)}
                className=" bg-gray-800 border border-yellow-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option>Tech</option>
                <option>Academics</option>
                <option>Welfare</option>
              </select>
            </div>
            <div className="bg-yellow-500 text-black font-bold px-4 mt-5 h-10 flex items-center justify-center rounded hover:bg-yellow-600">Preview</div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of the announcement...."
              className="w-full bg-gray-800 border border-yellow-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-400 mb-2">Body</label>
            <textarea 
              id="body"
              rows="8"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Please enter the details here..."
              className="w-full bg-gray-800 border border-yellow-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Attachments</label>
            <div className="flex items-center gap-4">
              <label htmlFor="attachment-file" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                <PaperclipIcon className="w-5 h-5" />
                <span>Choose File</span>
              </label>
              <input 
                type="file" 
                id="attachment-file" 
                className="hidden"
                onChange={handleFileChange}
              />
              {attachment && <span className="text-gray-400">{attachment.name}</span>}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end items-center gap-4">
            {message && <p className="text-green-400 text-sm">{message}</p>}
            <button 
              type="submit"
              className="bg-yellow-400 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
