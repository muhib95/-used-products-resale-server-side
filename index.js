const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT||5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()



app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c8jqjnz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const usersCollection=client.db('usedTvBuyAndSell').collection('users');




        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result=await usersCollection.insertOne(user);
            res.send(result)
      
          })



    }
    finally{

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Worldnbbmbm!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})