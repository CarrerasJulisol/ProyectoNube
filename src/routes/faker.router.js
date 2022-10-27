import { Router } from "express";
import __dirname from "../utils.js";
import faker from "faker";

faker.locale = 'es';
const { commerce, image } = faker;

const router = Router();

// faker
router.get('/products-test', async (req, res)=>{
    let testProducts = [];
    for(let i=0; i<5; i++){
        testProducts.push({
            name:commerce.productName(),
            price:commerce.price(),
            image:image.imageUrl()
        })
    }
    res.render('products-test',{
        testProducts
    });
})

export default router
