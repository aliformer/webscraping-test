const { DataTypes } = require("sequelize");
const { db } = require("./model");

const SKU = db.define("sku", {
    skuId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    shopId: { type: DataTypes.INTEGER, allowNull: false },
    productName: {type: DataTypes.STRING, allowNull: false},
    discountedPrice: {type: DataTypes.FLOAT, allowNull: true},
    originalPrice: {type: DataTypes.FLOAT, allowNull: true},
    rating: {type: DataTypes.FLOAT, allowNull: true},
    soldCount: {type: DataTypes.INTEGER, allowNull: true},
    createdAt: {type: DataTypes.DATE, allowNull: false},
});

const SKURanking = db.define("sku_ranking", {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    skuId: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
    shopId: {type: DataTypes.INTEGER, foreignKey: true, allowNull: false},
    ranking: {type: DataTypes.INTEGER},
    keyword: {type: DataTypes.STRING}
});

const Shop = db.define("shop", {
    shopId: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    shopName: {type: DataTypes.STRING}
});

module.exports = { SKU, SKURanking, Shop };
