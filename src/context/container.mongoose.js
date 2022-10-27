import __dirname from "../utils.js";
import mongoose from "mongoose";

const productsSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    stock:Number
})

const chatSchema = mongoose.Schema({
    author:Object,
    date:String,
    message:String
})

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

// CLASE CONTENEDOR //
class Container {
    constructor() {
        this.modelProd = mongoose.model('products',productsSchema);
        this.modelChat = mongoose.model('chat',chatSchema);
    }

    async save(document) {
        try {
            return this.modelProd.create(document);
        } catch (error) {
            return console.log(`Hubo un error al guardar: ${error}`)
        }
    }

    async getByID(id) {
        try {
            return this.modelProd.findOne({_id:id})
        } catch (error) {
            console.log(`Hubo un error, no se encontró el elemento por ID. Error: ${error}`)
        }
    }

    async getAll() {
        try {
            return this.modelProd.find();
        } catch (error) {
            console.log(`Hubo un error, no se pudo leer el archivo. Error: ${error}`)
        }
    }

    async deleteByID(id) {
        try {
            await this.modelProd.deleteOne({_id:id})
            return console.log("Producto eliminado.");
        } catch (error) {
            console.log(`Ups, hubo un error. Error: ${error}`)
        }
    }

    async deleteAll() {
        try {
            return this.modelProd.drop()
        } catch (error) {
            console.log(`Hubo un error, no se pudo escribir el archivo. Error: ${error}`)
        }
    }

    async getRandom() {
        const read = await this.getAll();
        const num = Math.floor(Math.random()*read.length)
        return await read[num]
    }

    async toUpdate(product, update){
        if (update.name != undefined){
            await this.modelProd.updateOne({_id:product.id},{$set:{name:update.name}})
            console.log('Se actualizó el nombre.');
        }
        if (update.price != undefined){
            await this.modelProd.updateOne({_id:product.id},{$set:{price:update.price}})
            console.log('Se actualizó el precio.');
        }
        if (update.image != undefined){
            await this.modelProd.updateOne({_id:product.id},{$set:{image:update.image}})
            console.log('Se actualizó la imagen.');
        }
        if (update.stock != undefined){
            await this.modelProd.updateOne({_id:product.id},{$set:{stock:update.stock}})
            console.log('Se actualizó el stock.');
        }
        return await this.getByID(product.id)
    }

    /* CHAT */
    async saveChat(messages) {
        try {
            return this.modelChat.create(messages);
        } catch (error) {
            return console.log(`Hubo un error: ${error}`)
        }
    }

    async getChat() {
        try {
            return this.modelChat.find();
        } catch (error) {
            console.log(`Hubo un error, no se pudo leer el archivo. Error: ${error}`)
        }
    }

    /*async getNormalize(){
        let chatBox = await this.getChat()
        const author = new schema.Entity('authors');
        const message = new schema.Entity('messages',{
            author:author
        });
        const chat = new schema.Entity('chat',{
            author:author,
            messages:[message]
        })
        const normalizedData = normalize(chatBox,chat);
        return normalizedData
    }*/
}

export default Container;
