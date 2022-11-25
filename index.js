const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT||5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()



app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c8jqjnz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function varifyJWT(req,res,next){
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'unauthorize'});
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, function(err, decoded) {
    if(err){
      return res.status(401).send({message:'unauthorize'});
    }
    req.decoded=decoded;
    next();
  });


}

async function run() {
    try{
        const usersCollection=client.db('usedTvBuyAndSell').collection('users');
        const categoryCollection=client.db('usedTvBuyAndSell').collection('category');
        const productsCollection=client.db('usedTvBuyAndSell').collection('products');
        const bookingCollection=client.db('usedTvBuyAndSell').collection('booking');




// jwt token google

          app.post('/jwt',(req,res)=>{
            const user=req.body;
            const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRETE,{expiresIn:'7days'})
            res.send({token})

          }) 


        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result=await usersCollection.insertOne(user);
            res.send(result)
      
          })

          app.get('/category', async(req,res)=>{
            const query={};
            const result=await categoryCollection.find(query).toArray();
            res.send(result);
      
          })
          // app.get('/category/:id', async(req,res)=>{
          //   const id=req.params.id;
            
          //   const query={ brandId:id};
          //   const result=await productsCollection.find(query).toArray();
          //   res.send(result);
      
          // })

          app.get('/products/:brand',async(req,res)=>{
            const brand=req.params.brand;
           
            const query={brand:brand}
            const products=await productsCollection.find(query).toArray();
            res.send(products)
      
          })


        
          app.post('/booking',async(req,res)=>{
            const booked=req.body;

            const query={productId:booked.productId,
              email:booked.email

            };
            const alreadyHave=await bookingCollection.find(query).toArray();
            if(alreadyHave.length){
              const message="You already order"
              return res.send({acknowledged:false,message})

            }
            
            const result=await bookingCollection.insertOne(booked);
            res.send(result)
      
          })


          app.get('/orders',varifyJWT, async(req,res)=>{
            const userEmail=req.query.email;
            // console.log(userEmail);
            const query={email:userEmail};
            const bookings=await bookingCollection.find(query).toArray();
            res.send(bookings);
      
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