import { useState } from "react";
import "./App.css";

function App() {
  const viewNotice = () => {
    fetch("/api/notices")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load notices");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const viewArchivedNotice = () => {
    fetch("/api/notices/archived")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load notices");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const viewAdmins = () => {
    fetch("/api/notices/admins")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load notices");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      <div className="bg-slate-900 h-svh w-svw">
        <div className="flex justify-center p-2 bg-slate-950 text-amber-100 text-3xl">
          <strong>Testing Noticeboard stuff</strong>
        </div>
        <div className="my-2 h-3/4 w-svw border-2 border-amber-300 flex p-5">
          <button
            onClick={viewNotice}
            className="text-center border-2 p-0.5 border-amber-300 h-[30px] w-[100px] text-amber-50"
          >
            First notice
          </button>
          <button
            onClick={viewArchivedNotice}
            className="text-center border-2 p-0.5 border-amber-300 h-[30px] w-[100px] text-amber-50"
          >
            Archived notice
          </button>
          <button
            onClick={viewAdmins}
            className="text-center border-2 p-0.5 border-amber-300 h-[30px] w-[100px] text-amber-50"
          >
            Admins
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
