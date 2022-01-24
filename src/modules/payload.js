const ENDPOINT = "https://gql.tokopedia.com";


const SHOPINFO_QUERY = () => { return `
query ShopInfoCore($id: Int!, $domain: String) {
    shopInfoByID(input: {shopIDs: [$id], fields: ["active_product", "address", "allow_manage", 
   "assets", "core", "closed_info", "create_info", "favorite", "location", "status", "is_open", "othergoldos", "shipment", "shopstats", "shop-snippet", "other-shiploc", "shopHomeType"], domain: 
   $domain, source: "shoppage"}) {
    result {
    shopCore {
    description
    domain
    shopID
    name
    }
    }
    }
   }
   Variables 
   { “id”: ${shopId}}
   `};
const PDPINFO_QUERY = (productId) => { return {
    query: `
query {
    getPDPInfo(productID:${productId}) {
    basic {
    id
    alias
    shopID
    name
    price
    url
    }
    campaign{
    discountedPrice
    percentageAmount
    }
    stats {
    rating
    }
    txStats {
     itemSoldPaymentVerified
    itemSold
    }
    stock {
    value
    }
    }
    }`
}}

const PRODUCTlIST_QUERY = (keyword, rows, page) => { return {
    operationName: "SearchProductQueryV4",
    variables: {
        params: `device=desktop&navsource=home&ob=23&page=1&q=${keyword}%20tangan&related=true&rows=${rows}&safe_search=false&scheme=https&shipping=&source=search&srp_component_id=02.01.00.00&st=product&start=${page}&topads_bucket=true&unique_id=d2be9459f0de0e40e84953f1df1b0369&user_addressId=&user_cityId=176&user_districtId=2274&user_id=&user_lat=&user_long=&user_postCode=&variants=`
    },
    query :  `
    query SearchProductQueryV4($params: String!) {
        ace_search_product_v4(params: $params) {
          header {
          totalData
          }
          data {
          products {
            id
            name
            badges {
            title
            }
            countReview
            discountPercentage
            labelGroups {
            position
            title
            }
            originalPrice
            price
            priceRange
            rating
            shop {
            id
            name
            url
            city
            }
            url
          }
          }
        }
      }
      `
}
}

  module.exports = { ENDPOINT, SHOPINFO_QUERY, PDPINFO_QUERY, PRODUCTlIST_QUERY }