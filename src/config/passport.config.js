import passport from "passport";
import local from 'passport-local';
import UserService from "../context/users.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const services = new UserService()

const initializePassport = () =>{
    passport.use('register',new LocalStrategy({passReqToCallback:true,usernameField:"email"},
    async (req, email, password, done)=>{
        try{
            const { name } = req.body;
            if(!name||!email||!password) return done(null,false,{message:"Valores incompletos"});
            //verificamos si el usuario existe
            const exists = await services.findEmail(email);
            if(exists) return done(null,false,{message:"El usuario ya existe"});
            //lo guardamos en la base
            const newUser = {
                name,
                email,
                password:createHash(password)
            }
            let result = await services.createUser(newUser);
            return done(null,result)
        }catch(error){
            done(error)
        }
    }))

    passport.use('login',new LocalStrategy({usernameField:'email'},async(email, password, done)=>{
        if(!email||!password) return done(null,false,{message:"Valores incompletos"});
        let user = await services.findEmail(email);
        if(!user) return done(null,false,{message:"El usuario no existe"});
        if(!isValidPassword(user, password)) return done(null,false,{message:"La contraseña es incorrecta."});
        return done(null,user);
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async(id,done)=>{
        let result = await services.findID(id)
        return done(null,result);
    })
}

export default initializePassport;