// src/api.js

// Base API URLs
export const api = "http://localhost:5000/api";

export const url = {
  prod: {
    notices: "/api/notices",
    archived: "/api/notices/archived",
    admins: "/api/notices/admins",
    login: "/api/auth/login",
    check: "/api/auth/check",
  },
  dev: {
    notices: api + "/notices",
    archived: api + "/notices/archived",
    admins: api + "/notices/admins",
    login: api + "/auth/login",
    check: "/api/auth/check",
  },
};

// ------------------ Fetch Functions ------------------

// Get all notices
// export const viewNotice = async () => {
//   const res = await fetch(url.dev.notices);
//   if (!res.ok) throw new Error("Failed to load notices");
//   return res.json();
// };

export const viewNotice = () => {
  return fetch(url.dev.notices)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load notices");
      }
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
};

// Get archived notices
export const viewArchivedNotice = async () => {
  const res = await fetch(url.dev.archived);
  if (!res.ok) throw new Error("Failed to load archived notices");
  return res.json();
};

// Get admins
export const viewAdmins = async () => {
  const res = await fetch(url.dev.admins);
  if (!res.ok) throw new Error("Failed to load admins");
  return res.json();
};

// Reverting back to original login call
export const login = (user, ps) => {
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
        window.location.reload(); // page doesn't recognize admin is logged in after logging in

        //also, need to reset the username and passwords fields
        setUsername("");
        setPassword("");
        console.log("Login successful!");
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
// // Login function
// export const login = async (username, password) => {
//   if (localStorage.getItem("authToken")) {
//     console.log("User already logged in as admin!");
//     return;
//   }

//   const loginPayload = { username, password };
//   const res = await fetch(url.dev.login, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(loginPayload),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to log in");
//   }

//   const data = await res.json();
//   localStorage.setItem("authToken", data.token);
//   return data;
// };

// Logout
export const logout = () => {
  if (!localStorage.getItem("authToken")) {
    throw new Error("User not logged in");
  }
  localStorage.removeItem("authToken");
};

// auth check
export const checkAuth = async (adminToken) => {
  fetch(url.dev.check, {
    method: "GET",
    headers: {
      authorization: adminToken,
    },
  })
    .then((res) => {
      if (!res.ok) {
        const err = res.json();
        throw new Error(err.message || "User Not logged in.");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// Create a notice
export const createNotice = async (title, content) => {
  const adminToken = localStorage.getItem("authToken");
  if (!adminToken) throw new Error("No admin user is logged in.");

  const noticePayload = { title, content };
  const res = await fetch(url.dev.notices, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: adminToken,
    },
    body: JSON.stringify(noticePayload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create new notice!");
  }

  return res.json();
};

// Delete a notice
export const delNotice = async (id) => {
  const adminToken = localStorage.getItem("authToken");
  if (!adminToken) throw new Error("No admin is logged in.");

  const res = await fetch(`${url.dev.notices}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: adminToken,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Couldn't delete the notice.");
  }

  return res.json();
};
