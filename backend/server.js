const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const axios = require('axios'); // Import axios
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

let db; // Declare db variable

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db('my_website');
    const collection = db.collection('data_uml');
    const usersCollection = db.collection('users');

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
    app.get('/employee', async (req, res) => {
      try {
        const projection = {
          'Employee Name': 1,
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
          {
            projection: {
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
              Remarks: 1,
            },
          }
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

    // Add new asset
    app.post('/add_asset', async (req, res) => {
      const newItem = req.body;

      if (!newItem['Employee Name']) {
        return res.status(400).json({ message: 'Employee Name is required' });
      }

      try {
        const result = await collection.insertOne(newItem);
        res.status(201).json({ message: 'Asset added successfully', id: result.insertedId });
      } catch (error) {
        console.error('Error adding new asset:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    });

    // Delete an asset by ID
    app.delete('/delete_asset/:id', async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }

      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Asset not found' });
        }

        res.json({ message: 'Asset deleted successfully' });
      } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ message: 'Server error', error });
      }
    });

    // Fetch dashboard data
    app.get('/api/dashboard-data', async (req, res) => {
      try {
        if (!db) {
          return res.status(500).json({ message: 'Database not initialized' });
        }

        const collection = db.collection('data_uml');

        // Get total number of documents
        const totalAssets = await collection.countDocuments();

        // Get total assigned assets
        const totalAssignedAssets = await collection.countDocuments({ assigned: true });

        // Calculate total unassigned assets
        const totalUnassignedAssets = await collection.countDocuments({ Scraped: { $in: ["yes", "Yes"] }});


        // Assume you have a separate collection for employees
        const totalEmployees = await db.collection('data_uml').countDocuments();

        res.json({
          totalAssets,
          totalAssignedAssets,
          totalUnassignedAssets,
          totalEmployees
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    // Fetch employee list for login purposes
    app.get('/emplist', async (req, res) => {
      try {
        const projection = {
          'Location Name': 1,
          'Plant': 1,
          'Asset No': 1,
          'Department': 1,
          'Employee Name': 1,
          'Domain ID': 1,
          'EMAIL ID': 1,
          'PH_NO': 1,
          'Make': 1,
          'ITEMS': 1,
          'Model No': 1,
          'M/C Serial No': 1,
          'Processor': 1,
          'Speed': 1,
          'RAM': 1,
          'HDD': 1,
          'Monitor': 1,
          'Mac Address': 1,
          'Operating System': 1,
          'MS Office/Libre Office': 1,
          'Invoice Date': 1,
          'Warranty/AMC Expiry Date': 1,
          'Role': 1
        };

        const data = await collection.find({}, { projection }).toArray();

        res.json({ data: data });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from the database");
      }
    });

    let users = [];

    // Function to fetch users from /emplist endpoint
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:${PORT}/emplist`);
        users = response.data.data.map((user) => ({
          employeeName: user['Employee Name'],
          _id: user._id,
          locationName: user['Location Name'],
          plant: user['Plant'],
          department: user['Department'],
          domainID: user['Domain ID'],
          phNo: user['PH_NO'],
          role: user['Role']
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetch users when the server starts
    fetchUsers();

    app.post('/auth/login', (req, res) => {
      const { username, password } = req.body;
      const user = users.find((u) => u.employeeName === username);

      if (user && user._id.slice(-7) === password) {
        res.json({ success: true, user });
      } else {
        res.json({ success: false });
      }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
