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

export const viewNotice = async () => {
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

export const viewArchivedNotice = async () => {
  const res = await fetch(url.dev.archived);
  if (!res.ok) throw new Error("Failed to load archived notices");
  return res.json();
};

export const viewAdmins = async () => {
  const res = await fetch(url.dev.admins);
  if (!res.ok) throw new Error("Failed to load admins");
  return res.json();
};

// api.js
export const login = async (username, password) => {
  const res = await fetch(url.dev.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let errMsg = "Invalid credentials";
    try {
      const errData = await res.json();
      errMsg = errData.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await res.json();
  localStorage.setItem("authToken", data.token);
  return data;
};

export const logout = () => {
  if (!localStorage.getItem("authToken")) throw new Error("User not logged in");
  localStorage.removeItem("authToken");
};

export const checkAuth = async (adminToken) => {
  const res = await fetch(url.dev.check, {
    method: "GET",
    headers: { authorization: adminToken },
  });
  if (!res.ok) throw new Error("User Not logged in.");
};

export const createNotice = async (title, content) => {
  const adminToken = localStorage.getItem("authToken");
  if (!adminToken) throw new Error("No admin user is logged in.");

  const noticePayload = { title, content };
  const res = await fetch(url.dev.notices, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: adminToken },
    body: JSON.stringify(noticePayload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create new notice!");
  }

  return res.json();
};

export const delNotice = async (id) => {
  const adminToken = localStorage.getItem("authToken");
  if (!adminToken) throw new Error("No admin is logged in.");

  const res = await fetch(`${url.dev.notices}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", authorization: adminToken },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Couldn't delete the notice.");
  }

  return res.json();
};
