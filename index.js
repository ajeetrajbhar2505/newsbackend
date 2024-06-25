const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));
const newsRoute = require('./routes/newsRoute')
const chatgptRoute = require('./routes/chatgptRoute')
const connection = require('./utils/database');


app.use('/askQuestion', chatgptRoute);
app.use('/', newsRoute);



// Establish database connection
connection()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if unable to connect to the database
    });




