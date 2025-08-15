import Notice from "../models/notice.js";

/*
@access Public
@route GET /api/notices
*/

const getActiveNotice = async (req, res) => {
  try {
    const notices = await Notice.findAll({
      where: {
        isArchived: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/*
@access Public
@route GET /api/notices/archived
*/
const getArchivedNotice = async (req, res) => {
  try {
    const archived = await Notice.findAll({
      where: { isArchived: true },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(archived);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getActiveNotice, getArchivedNotice };
