import { useState } from "react";
import "./App.css";

function App() {
  //the below url is for dev testing (live preview), before deploying change all teh fetch urls to prod values instead of dev
  //also remove port 5173 from app.js in cors permissions
  const api = "http://localhost:5000/api";
  const url = {
    prod: {
      notices: "/api/notices",
      archived: "/api/notices/archived",
      admins: "/api/notices/admins",
      login: "/api/auth/login",
    },
    dev: {
      notices: api + "/notices",
      archived: api + "/notices/archived",
      admins: api + "/notices/admins",
      login: api + "/auth/login",
    },
  };
  const viewNotice = () => {
    fetch(url.dev.notices)
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
    fetch(url.dev.archived)
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
    fetch(url.dev.admins)
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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (user, ps) => {
    //check if already logged in before logging in again
    if (localStorage.getItem("authToken")) {
      console.log("User already logged in as admin!");
      return;
    } else {
      const loginPayload = {
        username: user,
        password: ps,
      };
      fetch(url.dev.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(loginPayload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(err.message || "Failed to log in");
            });
          }
          return res.json();
        })
        .then((data) => {
          localStorage.setItem("authToken", data.token); //storing token in local storage with name "authToken"
          console.log("Login successful!");
        });
    }
  };
  const handleLogin = (event) => {
    event.preventDefault(); //prevents the default browser refreshing on formsubmission
    if (username.trim() && password.trim()) {
      login(username.trim(), password.trim());
    } else {
      console.log("Username and password cannot be empty.");
    }
  };
  const logout = () => {
    if (!localStorage.getItem("authToken")) {
      throw new Error("User not logged in");
    } else {
      localStorage.removeItem("authToken");
      console.log("Logged out successfully");
    }
  };
  const createNotice = (title, content) => {};
  return (
    <>
      <div className="bg-slate-900 h-svh w-svw">
        <div className="bg-slate-900 text-amber-100 p-4 sm:p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10 p-4 bg-slate-950 rounded-xl">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-100">
                Noticeboard Dev Testing Layout
              </h1>
              <p className="mt-2 text-lg text-amber-300">
                Basic layout for testing api calls.
              </p>
            </header>

            {/* <!-- === Example 4: Auto-Sizing with flex-1 === --> */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-3 text-amber-200">
                Auth functions
              </h2>
              <p className="text-amber-300 mb-3">
                The token is stored in localstorage as authToken.
              </p>
              <div className="flex flex-row gap-4 p-5 bg-slate-950 rounded-xl border-2 border-amber-300">
                <form onSubmit={handleLogin} className="flex gap-4">
                  <button
                    type="submit"
                    className="w-32 border-2 border-amber-300 text-amber-50 font-medium p-6 rounded-lg text-center flex-shrink-0 transition-all duration-300 ease-in-out hover:scale-105 hover:border-amber-100 hover:shadow-lg hover:shadow-amber-300/10 cursor-pointer"
                  >
                    Login
                  </button>
                  <input
                    type="text"
                    placeholder="username"
                    aria-label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 border-2 border-amber-300 text-amber-50 font-medium p-6 rounded-lg text-left "
                  />
                  <input
                    type="password" // this type obscures the input values
                    id="admin-password"
                    placeholder="password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 border-2 border-amber-300 text-amber-50 font-medium p-6 rounded-lg text-left "
                  />
                </form>
                <button
                  onClick={logout}
                  className="w-30 border-2 border-amber-300 text-amber-50 font-medium p-6 rounded-lg text-center flex-shrink-0 transition-all duration-300 ease-in-out hover:scale-105 hover:border-amber-100 hover:shadow-lg hover:shadow-amber-300/10 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
