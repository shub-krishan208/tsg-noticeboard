const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: "admin",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    //automatically adds createdAt and updatedAt fields in the table
    timestamps: true,
  }
);

module.exports = Notice;
