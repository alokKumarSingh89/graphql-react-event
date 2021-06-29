const express = require("express");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const graphQLSchema = require("./graphql/schema");
const graphQLResolver = require("./graphql/resolvers");
const isAuth = require("./middleware/is-auth")
const app = express();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Method',"POST,GET,OPTIONS");
    res.setHeader('Access-Control-Allow-Headers',"Content-Type,Authorization");
    if(req.method === "OPTIONS"){
        return res.sendStatus(200);
    }
    next();

})
app.use(isAuth);
app.use("/graphql", graphqlHTTP({
    schema: graphQLSchema,
    rootValue:graphQLResolver ,
    graphiql: true
}))
const PORT = 4000;
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-uxmix.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        app.listen(PORT,()=>console.log(`Server Running on ${PORT}`));
    }).catch(error=>console.error(error));
