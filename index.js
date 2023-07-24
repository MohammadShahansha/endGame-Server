const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_aplicant}:${process.env.DB_pass}@cluster0.ysflwyz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const collegeCollection = client.db("Admission").collection("college");
    const allCollegeCollection = client.db("Admission").collection("allColleges");
    const candidateCollection = client.db("Admission").collection("candidate");
    const reviewCollection = client.db("Admission").collection("review");

    app.get("/colleges", async (req, res) => {
      const result = await collegeCollection.find().toArray()
      res.send(result)
    })

    app.get('/eachCollege/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await collegeCollection.findOne(query)
      res.send(result);
    })


    app.get("/allColleges", async (req, res) => {
      const result = await allCollegeCollection.find().toArray()
      res.send(result)
    })

    app.get('/detailCollege/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await allCollegeCollection.findOne(query)
      res.send(result);
    })

    app.get('/apply/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allCollegeCollection.findOne(query)
      res.send(result);
    })

    app.post('/candidate', async (req, res) => {
      const item = req.body;
      const result = await candidateCollection.insertOne(item)
      res.send(result);
    })

    app.get('/candidate', async (req, res) => {
      const result = await candidateCollection.find().toArray();

      const college=await allCollegeCollection.find().toArray();

      for(let i=0;i<result.length;i++){
        for (let j=0;j<college.length;j++){
          if(result[i].id==college[j]._id){
            result[i].id=college[j];
          }
        }
      }
      // console.log(result)
      
      
      res.send(result);
    })

    app.post('/review', async (req, res) => {
      const item = req.body;
      const result = await reviewCollection.insertOne(item)
      res.send(result);
    })

    app.get("/getreview", async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Surver is Running')
})

app.listen(port, () => {
  console.log(`surver is running on port ${port}`);
})