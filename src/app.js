import express from 'express';
import __dirname from '../src/utils.js';
import viewsRouter from '../src/routes/views.router.js';
import fakerRouter from './routes/faker.router.js';
import sessionsRouter from './routes/sessions.router.js';
import { Server } from 'socket.io';
import Container from './context/container.mongoose.js';
import mongoose from 'mongoose';
import passport from 'passport';
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.config.js";

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on ${server.address().port}`));
const connection = mongoose.connect(`mongodb+srv://julieta:12345@proyecto-carreras.appkwcp.mongodb.net/Base001?retryWrites=true&w=majority`)
const io = new Server(server);
const File = new Container()

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'));
app.use(session({
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://julieta:12345@proyecto-carreras.appkwcp.mongodb.net/Base001?retryWrites=true&w=majority',
        ttl:1000
    }),
    secret:'th3Sess1onS2',
    resave:false,
    saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/products',viewsRouter);
app.use('/api',fakerRouter);
app.use('/session',sessionsRouter);

io.on('connection',async (socket) => {
    console.log('socket connected')
    const chat = await File.getChat()
    io.emit("newMessage",chat)

    socket.on('addProduct', async data => {
        console.log(data)
        const update = await File.save(data)
        const allProducts = await File.getAll()
        io.emit('allProducts', allProducts)
    })

    socket.on('messages',async data => {
        console.log(data)
        const chat = await File.saveChat(data)
        const readChat = await File.getChat()
        io.emit("newMessage",readChat)
    })
})