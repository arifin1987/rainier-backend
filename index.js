const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.59h68ks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const courseCollection = client.db("rainier").collection("courses");

    app.get("/courses", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.findOne(query);
      res.send(result);
    });

    app.post("/courses", async (req, res) => {
      const items = req.body;
      const result = await courseCollection.insertOne(items);
      res.send(result);
    });

    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = courseCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCourses = req.body;
      const courses = {
        $set: {
          description: updateCourses.description,
          price: updateCourses.price,
          duration: updateCourses.duration,
        },
      };
      const result = await courseCollection.updateOne(filter, courses, options);
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
  res.send(" rainier server is running");
});

app.listen(port, () => {
  console.log(`app is runnig on port ${port}`);
});
