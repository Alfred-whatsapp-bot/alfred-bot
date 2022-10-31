// const { Sequelize } = require("sequelize");
// require("dotenv").config();
// const sequelize = new Sequelize(
//   `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`
// );

// const { DataTypes } = require("sequelize");
// const Users = sequelize.define(
//   "user",
//   {
//     user_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     nome: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//     },
//     senha: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     token: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: false,
//     freezeTableName: true,
//   }
// );

// module.exports = {
//   Users,
// };
