// src/api.js

// Base API URLs
export const api = "http://localhost:5000/api";

export const url = {
  prod: {
    notices: "/api/notices",
    archived: "/api/notices/archived",
  },
  dev: {
    notices: api + "/notices",
    archived: api + "/notices/archived",
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
