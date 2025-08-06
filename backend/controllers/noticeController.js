const Notice = require("../models/notice");
const Admin = require("../models/admin");
/*
@access Public
@route GET /api/notices
*/

exports.getActiveNotice = async (req, res) => {
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
exports.getArchivedNotice = async (req, res) => {
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

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin functions

/*
@access Private (admin)
@route POST /api/notices
*/
exports.createNotice = async (req, res) => {
  const { title, content } = req.body;

  try {
    const notice = await Notice.create({
      title,
      content,
      author: req.admin.username,
    });
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating the notice" });
  }
};

/*
@access Private (admin)
@route POST /api/notices/archive/:id
*/
exports.archiveNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);

    if (notice) {
      notice.isArchived = true;
      await notice.save();
      res.status(200).json({ message: "Notice archived successully" });
    } else {
      res.status(404).json({ message: "Notice not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/*
@access Private (admin)
@route DELETE /api/notices/:id
*/
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);

    if (notice) {
      await notice.destroy();
      res.json({ message: "Notice removed successfully" });
    } else {
      res.status(404).json({ message: "Notice not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
