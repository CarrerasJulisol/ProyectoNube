import { Router } from "express";
import __dirname from "../utils.js";
import Container from "../context/container.mongoose.js";

const router = Router();
const File = new Container();

router.get('/', async (req, res)=> {
    const allProducts = await File.getAll()
    res.render('products',{
        hasProducts:allProducts.length>0,
        allProducts,
        user: req.session.user
    });
})

// para verificar que todo se guarda bien:
router.get('/api', async (req, res)=> {
    const allProducts = await File.getAll()
    res.send(allProducts);
})

router.get('/chat', async (req, res)=> {
    const chat = await File.getChat()
    res.send(chat);
})

//normalizr
/*router.get('/normalized', async (req, res)=>{
    let normalize = await File.getNormalize()
    res.send(normalize)
})*/

export default router