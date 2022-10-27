import { Router } from "express";
import __dirname from "../utils.js";
import { createHash, isValidPassword } from "../utils.js";
import UserService from "../context/users.js";
import passport from 'passport';

const router = Router();
const services = new UserService()

router.get('/register', (req, res)=> {
    res.render('register')
})

router.post('/register',passport.authenticate('register',{failureRedirect:'/session/registerfail'}),async (req, res) =>{
    const { name, email, password } = req.body;
    if(!name||!email||!password) return res.status(400).send({status:"error",error:"Valores incompletos"})
    const exists = await services.findEmail(email)
    if(exists){
        return res.status(400).send({status:"error",error:"El usuario ya existe!"})
    }else{
        const newUser = {
            name,
            email,
            password:createHash(password)
        }
        let result = await services.createUser(newUser);
        res.send(result);
    }
})

router.get('/registerfail', (req,res)=>{
    res.status(500).send({status:"error",error:"Algo salió mal."})
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/session/loginfail'}),async (req, res)=>{
    const { email, password } = req.body;
    if(!email||!password){
        return res.status(400).send({status:"error",error:"Valores incompletos."})
    }else{
        console.log(email)
        let user = await services.findEmail(email);
        if (!user) return res.status(400).send({status:"error",error:"Credenciales incorrectas."})
        if(!isValidPassword(user,password)) return res.status(400).send({status:"error",error:"Contraseña incorrecta."})
        req.session.user={
            name:req.user.name,
            email:req.user.email,
            id:req.user._id
        }
        res.json({status:"success",playload:req.session.user})
    }
})

router.get('/login',(req, res)=> {
    res.render('login')
})

router.get('/loginfail',(req, res) =>{
    res.status(500).send({status:"error",error:"Error al intentar iniciar sesión."});
})

router.get('/logout', async (req, res)=> {
    req.session.destroy(err=>{
        if(err) return res.send("No se pudo cerrar la sesion. Intenta nuevamente!");
        else return res.send("Tu sesion fue cerrada exitosamente :)");
    })
})

router.get('/current', async (req, res)=> {
    if(req.session.user){
        res.send(req.session.user);
    }else{
        res.send("Inicia sesion primero!")
    }
})

export default router