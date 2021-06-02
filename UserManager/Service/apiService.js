const User = require('../Model/apiModel').User;
const dbConnection = require('../DB/connectDB');
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');
const ServiceUtil = require('../util/serviceutil');


module.exports = {
    async getAllUser(){
        await dbConnection(process.env.MONGODB_URL_API);
        let users = []
        let list = await User.find();
        if(list){
            for(var i=0;i<list.length;i++){
                let user = _.omit(list[i].toObject(), ['encrypted_password', 'virtualKey']);
                users.push(user)
            }
        }
        return users; 
    },
    async alreadyExists(email, username,phoneno){
    
        if(await this.getUserByLoginId(phoneno)){
            return true
        }
        if(await this.getUserByEmailId(email)){
            return true
        }
        if(await this.getUserById(username)){
            return true
        }
        return false
    },
    async createUser(input) {           
        await dbConnection(process.env.MONGODB_URL_API);
        const user = new User(input);
        let result = await User.create(user);
       
        var userFiltered = _.omit(result.toObject(), ['encrypted_password', 'virtualKey']);
        return userFiltered          

    }, 
    async getUserByEmailId(email) {
        await dbConnection(process.env.MONGODB_URL_API);
        let user = await User.findOne({"email" : email});
        if(user){
            user = _.omit(user.toObject(), ['encrypted_password', 'virtualKey']);
        }
        return user;        
    },  
    async getUserByLoginId(loginid) {
        await dbConnection(process.env.MONGODB_URL_API);
        let user = await User.findOne({"loginid" : loginid});
        if(user){
            user = _.omit(user.toObject(), ['encrypted_password', 'virtualKey']);
        }
        return user;        
    },
    async getUserById(userid) {
        await dbConnection(process.env.MONGODB_URL_API);
        let user = await User.findOne({"username" : userid});
        if(user){
            user = _.omit(user.toObject(), ['encrypted_password', 'virtualKey']);
        }
        return user;
    },
    async getUser(id) {
        await dbConnection(process.env.MONGODB_URL_API);
        let user = await User.findById(id);
        if(user){
            user = _.omit(user.toObject(), ['encrypted_password', 'virtualKey']);
        }
        return user;
    },

    async validateUser(dataToCheck) {
        let user;
        let check = false
       
        //console.log(" password " + dataToCheck.password);
        await dbConnection(process.env.MONGODB_URL_API);
        user = await User.findOne({ loginid: dataToCheck.loginid });
        if (user) {
            check = user.authenticate(dataToCheck.password);            
        } 
        return check

    },
    

};