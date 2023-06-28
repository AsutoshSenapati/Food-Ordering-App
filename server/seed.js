const { faker } = require('@faker-js/faker');
const MongoClient = require("mongodb").MongoClient;
const _ = require("lodash");

async function main() {
    const uri = "mongodb://localhost://27017";
    const client = new MongoClient(uri);
 
    try {
        await client.connect();  

        const productsCollection = client.db("food-ordering").collection("products");
        const categoriesCollection = client.db("food-ordering").collection("categories");
        
        productsCollection.drop();
        let categories = ['breakfast', 'lunch', 'dinner'].map((category) => { return { name: category } });
        await categoriesCollection.insertMany(categories);

        let imageUrls = [
            'https://images.pexels.com/photos/14122663/pexels-photo-14122663.jpeg',
            'https://images.pexels.com/photos/11111603/pexels-photo-11111603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/9792476/pexels-photo-9792476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        ]

        let products = [];
        for (let i = 0; i < 10; i+=1) {
            let newProduct = {
                name: faker.commerce.productName(),
                adjective: faker.commerce.productAdjective(),
                description: faker.commerce.productDescription(),
                price: faker.commerce.price(),
                category: _.sample(categories),
                imageUrl: _.sample(imageUrls)
            };
            products.push(newProduct);
        }
        await productsCollection.insertMany(products);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
