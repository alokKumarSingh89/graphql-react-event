const express = require("express");
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const graphQLSchema = require("./graphql/schema")
const graphQLResolver = require("./graphql/resolvers")
const app = express();
 app.use(bodyParser.json());

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
