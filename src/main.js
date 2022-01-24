const axios = require("axios");
const { db, connection } = require("./db/model");
const { userAgent } = require("./modules/utils");
const { ENDPOINT, SHOPINFO_QUERY, PRODUCTlIST_QUERY, PDPINFO_QUERY } = require("./modules/payload");
const { SKU, SKURanking, Shop } = require("./db/schema");
const { ChildProcess } = require("child_process");
const { forEach, indexOf } = require("lodash");

connection();

let temp = [];
let tempShop = [];

const axiosClient = axios.create();
axiosClient.interceptors.request.use(async (config) => {
    config.headers = {
        ...config.headers,
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive"
    };

    return config;
});

const searchSKU = async (page, rows, dump, keyword, limit, t) => {
    try {
        const request = await axiosClient(ENDPOINT, {
            method: "POST",
            headers: {
                common: {
                    userAgent: userAgent[Math.floor(Math.random() * userAgent.length)]
                }
            },
            data: JSON.stringify    ({
                ...PRODUCTlIST_QUERY(keyword, rows, page)
            })
        });
        const resp = await Promise.all([request]).then((res) => res.map((data) => data.data.data.ace_search_product_v4.data.products));
        const currDump = dump;
        dump = [...dump, ...normalize(resp[0], dump.length)];
        if (dump.length < limit && currDump.length < dump.length) {
            console.log("current data ====>", dump.length);
            await searchSKU(page + rows, rows, dump, keyword, limit, t);
        } else {
            temp = [...dump];
            console.log("Scraping is done.");
            console.log("Starting inserting data to database.");
            await SKU.bulkCreate(
                temp.map((data) => {
                    return {
                        skuId: data.skuId,
                        productName: data.productName,
                        shopId: data.shopId,
                        discountedPrice: data.discountedPrice,
                        originalPrice: data.originalPrice,
                        rating: 0,
                        soldCount: data.soldCount,
                        createdAt: data.createdAt
                    };
                }),
                { updateOnDuplicate:['createdAt'], transaction: t }
            );
            await Shop.bulkCreate( temp.map( data => { return { shopId: data.shopId, shopName: data.shopName }}), { updateOnDuplicate: ['shopName'], transaction: t});
            await SKURanking.bulkCreate(temp.map((data, index) => { return { skuId: data.skuId, ranking: data.ranking, shopId:data.shopId, keyword: keyword }}), {transaction: t});
            await t.commit();
            return temp;
        }
        return temp;
    } catch (error) {
        console.log(error);
        await t.rollback();
    }
};

const searchSKUById = async (productIds) => {
    try {
        productIds.forEach();
        const request = await axiosClient(ENDPOINT, {
            method: "POST",
            headers: {
                common: {
                    userAgent: userAgent[Math.floor(Math.random() * userAgent.length)]
                }
            },
            data: JSON.stringify({
                ...PDPINFO_QUERY(productId)
            })
        });
        const resp = await Promise.all([request]).then((res) => res.map((data) => data.data.data.getPDPInfo));
    } catch (error) {
        console.log(error);
    }
};
const normalize = (array,dumpLen) => {
    return array.map((data,index) => {
        return {
            skuId: data.id,
            shopId: data.shop.id,
            productName: data.name,
            discountedPrice: parseInt(data.price.replace(/[RP|.]/gi, "") || 0),
            originalPrice: parseInt(data.originalPrice.replace(/[RP|.]/gi, "")) ? parseInt(data.originalPrice.replace(/[RP|.]/gi, "")) : 0,
            rating: data.rating,
            ranking: dumpLen + index + 1, 
            soldCount: data.countReview ? data.countReview : 0,
            shopName: data.shop.name,
            createdAt: new Date()
        };
    });
};
const searchList = async (rows, keyword, limit) => {
    t = await db.transaction();
    try {
        await searchSKU(0, rows, [], keyword, limit, t);
    } catch (error) {
        console.log(error);
    } finally {
    }
};

const searchItemDetail = async () => {
    const t = await db.transaction();
    const dump = [];
    try {
        const temp = await SKU.findAll({ attributes: ["skuId"] });
        await temp.forEach(async (id) => {
            const result = await searchSKUById(id.skuId);
            dump.push(result);
            console.log(dump.length);
        });
    } catch (error) {
        t.rollback();
        console.log(error);
    }
};

module.exports = { searchList, searchItemDetail };
