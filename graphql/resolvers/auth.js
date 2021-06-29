const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user")

module.exports = {
    createUser: args =>{
        return User.findOne({email:args.userInput.email})
            .then(user=>{
                if(user){
                    throw new Error("User already exits");
                }
                return bcryptjs.hash(args.userInput.password,12)
            }).then(hashedPassword=>{
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });
                return user.save();
            }).then(result=>{
                return {...result._doc,password:null}
            }).catch(error=>{
                throw error
            });

    },
    login:async ({email,password})=>{
        const user = await User.findOne({email});
        if(!user){
            throw new Error("User doesn't exist");
        }
        const isEqual = bcryptjs.compare(password,user.passive);
        if(!isEqual){
            throw new Error("Password is incorrect");
        }
        const token = jwt.sign({userId:user._id,email:user.email},'somesuperkey',{
            expiresIn: '1h'
        })
        return {userId:user.id,token,tokenExpiration:1};
    }
}