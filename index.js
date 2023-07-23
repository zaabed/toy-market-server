const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lf3ijbn.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = client.db('ToyMarketPlaceDB').collection('toys');
        const addNewToysCollection = client.db('ToyMarketPlaceDB').collection('newToys');

        app.get('/toys', async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        //-------------------------------------------------------------------------------------

        app.get('/addToys', async (req, res) => {
            const result = await addNewToysCollection.find().toArray();
            res.send(result);
        })

        app.get('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { _id: 0, availableQuantity: 1, price: 1, detailsDescription: 1 },
            };
            const result = await addNewToysCollection.findOne(query, options);
            res.send(result);
        })

        app.post('/addToys', async (req, res) => {
            const addToys = req.body;
            const result = await addNewToysCollection.insertOne(addToys);
            res.send(result);
        })

        app.delete('/addToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addNewToysCollection.deleteOne(query);
            res.send(result);
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
    res.send('TOY MARKET PLACE WEBSITE IS RUNNING');
})
app.listen(port, () => {
    console.log(`Toy Market Place Website running on port : ${port}`);
})