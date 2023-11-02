const express = require('express');
const connectToMongoDB = require('./db');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/html/login.html'));
});
app.post('/', async (req, res) => {
    try {
      const { client, db, collection } = await connectToMongoDB('Building', 'users');
      const { email, password } = req.body;
      console.log(req.body);
      const user = await collection.findOne({'email': email});
      console.log(user);
      if (user) {
        if (password == user.password) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
      client.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password, mobileNumber} = req.body;
  
        const { client, db, collection } = await connectToMongoDB('Building', 'users');
    
        const collectionExists = await db.listCollections({ name: 'users' }).hasNext();
  
        if (!collectionExists) {
          await collection.createIndex({ email: 1 }, { unique: true });
          console.log('Unique key index created for email field');
        }

        const userDocument = {
          username,
          email,
          password:password,
          mobileNumber
        };
    
        const userResult = await collection.insertOne(userDocument);
        console.log('User document inserted successfully:', userResult.insertedId);

        client.close();
        res.status(200).json({ message: 'Form submitted successfully' });
      } catch (error) {
        console.log(error);
        console.error('Error submitting the form:', error);
        if (error.code === 11000) {
   
          res.status(400).json({ error: 'Duplicate entry. Please provide a unique key value.' });
        } else {
  
          res.status(500).json({ error: 'Error submitting the form' });
        }
      }
});
app.post('/admin', async (req, res) => {
    try {
      const { client, db, collection } = await connectToMongoDB('Building', 'admin');
      const { aid, password } = req.body;
      console.log(aid);
      const user = await collection.findOne({'aid': aid});
      console.log(user);
      if (user) {
        if (password == user.password) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid password' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
      client.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/html/signup.html'));
});
app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'views/html/admin.html'));
});
var gemail = "";
app.post('/builder', async (req, res) => {
  try {
    const { client, db, collection } = await connectToMongoDB('Building', 'Builders');
    const { email, password } = req.body;
    console.log(req.body);
    const user = await collection.findOne({'builderName': email});
    console.log(user);
    gemail = req.body.email;
    if (user) {
      if (password == user.builderPassword) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/addbuilder', async (req, res) => {
  try {
      const { builderName, builderPassword } = req.body;
      const { client, db, collection } = await connectToMongoDB('Building', 'Builders');
      // Insert the builder data into your MongoDB collection
      // Example code to insert data (make sure to use the correct collection and database names)
      const result = await collection.insertOne({
          builderName: builderName,
          builderPassword: builderPassword
      });

      res.status(200).json({ message: 'Builder added successfully' });
  } catch (error) {
      console.error('Error adding builder:', error);
      res.status(500).json({ error: 'Error adding builder' });
  }
});

// Add this route to get the list of builders
app.get('/getbuilders', async (req, res) => {
  try {
    const { builderName, builderPassword } = req.body;
    const { client, db, collection } = await connectToMongoDB('Building', 'Builders');

      // Retrieve the list of builders from your MongoDB collection
      // Example code to retrieve data (make sure to use the correct collection and database names)
      const builders = await collection.find({}).toArray();

      res.status(200).json(builders);
  } catch (error) {
      console.error('Error getting builders:', error);
      res.status(500).json({ error: 'Error getting builders' });
  }
});

// Add this route to delete a builder
app.delete('/deletebuilder/:name', async (req, res) => {
  try {

      // Delete the builder from your MongoDB collection based on the builderId
      // Example code to delete data (make sure to use the correct collection and database names)
  
      const { client, db, collection } = await connectToMongoDB('Building', 'Builders');
  
      await collection.deleteOne({ builderName:req.params.name });

      res.status(200).json({ message: 'Builder deleted successfully' });
  } catch (error) {
      console.error('Error deleting builder:', error);
      res.status(500).json({ error: 'Error deleting builder' });
  }
});

app.get('/builder',async (req,res)=>{
    res.sendFile(path.join(__dirname, 'views/html/builder.html'))
});
app.get('/add',async (req,res)=>{
  if(gemail.trim().length==0){
    res.sendFile(path.join(__dirname, 'views/html/builder.html'))
  }else{
    res.sendFile(path.join(__dirname,'/views/html/add.html'))}
})
app.get('/home',async (req,res)=>{
    if(gemail.trim().length==0){
      res.sendFile(path.join(__dirname, 'views/html/builder.html'))
    }else{
      res.sendFile(path.join(__dirname,'/views/html/homepage.html'))
    }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a unique name
  },
});

const upload = multer({ storage: storage });

// Add a route to handle project data submission
app.post('/addproject', upload.single('projectImage'), async (req, res) => {
  try {
    const { client, db, collection } = await connectToMongoDB('Building', 'projects');
    const { projectName, projectID, projectAddress, coordinates, ownerName, ownerEmail, architectName, engineerName } = req.body;

    // Get the uploaded image file information
    const projectImage = req.file;

    // Define the image file path for the database
    const imagePath = projectImage ? projectImage.path : '';

    const projectDocument = {
      projectMail:gemail,
      projectName,
      projectID,
      projectAddress,
      coordinates,
      ownerName,
      ownerEmail,
      architectName,
      engineerName,
      projectImage: imagePath, // Save the image path to the database
    };

    const projectResult = await collection.insertOne(projectDocument);
    console.log('Project document inserted successfully:', projectResult.insertedId);

    client.close();
    res.status(200).json({ message: 'Project added successfully' });
  } catch (error) {
    console.error('Error submitting the form:', error);
    res.status(500).json({ error: 'Error submitting the form' });
  }
});

app.get('/builderProjects', async (req, res) => {
  try {
    const { client, db, collection } = await connectToMongoDB('Building', 'projects');
    
    // Query projects by builder's email (gemail) from your MongoDB collection
    const projects = await collection.find({ projectMail: gemail }).toArray();

    client.close();
    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching builder projects:', error);
    res.status(500).json({ error: 'Error fetching builder projects' });
  }
});


// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));
const port = 3000; 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
