const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.cjmu2s6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const collageCollection = client.db("collageDb").collection("collages");
    const galleryCollection = client.db("collageDb").collection("gallery");

    // Get Collage Collection
    app.get("/collages", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });

    // Get single collage
    app.get("/collage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collageCollection.findOne(query);
      res.send(result);
    });

    // Gallery Collection
    app.get("/gallery", async (req, res) => {
      const result = await galleryCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Education Master!");
});

app.listen(port, () => {
  console.log(`Education Master listening on port ${port}`);
});

