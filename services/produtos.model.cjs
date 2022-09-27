const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "mysql://sa7f483b4shxxrq7:j9uazobqudc0zw61@qvti2nukhfiig51b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/zpzigit5o0jticwb"
);

const { DataTypes } = require("sequelize");
const Produtos = sequelize.define(
  "Produtos",
  {
    produto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  Produtos,
};

