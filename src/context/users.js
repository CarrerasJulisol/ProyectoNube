import mongoose from 'mongoose';

const collection = "users";

const usersSchema = new mongoose.Schema({
    name:String,
    email:Object,
    password:String
})

class UserService {
    constructor() {
        this.model = mongoose.model(collection,usersSchema);
    }

    async findEmail(email){
        console.log(email)
        return this.model.findOne({email:email})
    }

    async createUser(newA){
        return this.model.create(newA)
    }

    async findID(id){
        return this.model.findOne({_id:id})
    }
}


export default UserService;