const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('my_website');
    const collection = database.collection('uml_data');

    // Define routes

    // Fetch all items
    app.get('/items', async (req, res) => {
      try {
        const items = await collection.find().toArray();
        res.json(items);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Fetch all data for report (admin access)
    app.get('/admin/genReport', async (req, res) => {
      try {
        const data = await collection.find().toArray();
        res.json(data); // Send data as JSON
      } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from MongoDB');
      }
    });

    // Add new field to the collection
    app.post('/addField', async (req, res) => {
      const { fieldName, fieldType } = req.body;

      if (!fieldName || !fieldType) {
        return res.status(400).send('Field name and type are required');
      }

      try {
        const updateQuery = { $set: { [fieldName]: getDefaultValue(fieldType) } };

        await collection.updateMany({}, updateQuery);

        res.status(200).send('Field added successfully');
      } catch (error) {
        console.error('Error adding field to DB:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    const getDefaultValue = (fieldType) => {
      switch (fieldType) {
        case 'String':
          return '';
        case 'Number':
          return 0;
        case 'Boolean':
          return false;
        default:
          return null;
      }
    };

    // Update an asset by ID
    app.put('/edit_asset/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Asset not found' });
        }

        res.json({ message: 'Asset updated successfully' });
      } catch (error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    });

    // Fetch employee list
    app.get('/emplist', async (req, res) => {
      try {
        const projection = {
          'Employee Name': 1,
          'EMAIL ID': 1,
          'PH_NO': 1,
          'Domain ID': 1,
          // Add other columns as needed
        };

        const data = await collection.find({}, { projection }).toArray();
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from the database");
      }
    });

    // Fetch asset details by ID
    app.get('/get_asset/:id', async (req, res) => {
      try {
        const item = await collection.findOne(
          { _id: new ObjectId(req.params.id) },
          { projection: {
              Make: 1,
              ITEMS: 1,
              'Model No': 1,
              'M/C Serial No': 1,
              Processor: 1,
              Speed: 1,
              RAM: 1,
              HDD: 1,
              SSD: 1,
              PORT: 1,
              Monitor: 1,
              'Mac Address': 1,
              'Operating System': 1,
              'OS Lic Key': 1,
              'MS Office/Libre Office': 1,
              'MS Office License No': 1,
              'Model Year': 1,
              'P O Number': 1,
              'Invoice No': 1,
              'Invoice Date': 1,
              'Invoice Amount': 1,
              'Supplier Name During Purchase': 1,
              'Warranty/AMC Expiry Date': 1,
              'If any AMC, Put Service Provider Name': 1,
              'AMC Period': 1,
              'AMC TYPE': 1,
              Remarks: 1
          } }
        );
        if (!item) {
          return res.status(404).json({ error: 'Asset not found' });
        }
        res.json(item);
      } catch (err) {
        console.error('Error fetching asset details:', err);
        res.status(500).json({ error: 'Error fetching asset details' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);
