const dotenv = require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const connect = require('./database/db.js');
const users = require('./models/users.js');
const Policy = require('./models/policy.js');
const Joi = require("joi");
const app = express();
const secretKey=process.env.JWT_SECRET;
const cors = require('cors');
app.use(cors());

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
connect();

const { v4: uuidv4 } = require('uuid');

let USERS= [
{
    name:'Spatika',
    age: 21,
    gender: "female",
    isSmoke: true,
    isDiabetic: false,
    incomePerAnnum: 500000,
    id: '1b892a53-l310-4347-b350-14c017fe0872'
},
{
    name:'Lucky',
    age: 49,
    gender: "female",
    isSmoke: false,
    isDiabetic: false,
    incomePerAnnum: 900000,
    id: '1b772a93-f318-4347-b350-14d917fe0892'
},
{
    name:'Nipun',
    age: 30,
    gender: "male",
    isSmoke: false,
    isDiabetic: true,
    incomePerAnnum: 1000000,
    id: '1d772x53-f318-4347-b350-14f017fe0018'
}
];

let policies = [
    {
        policyNum: 1,
        premium: 20000,
        sumAssured: 1000000,
        policyTerm: '5 years',
        frequency: 'Annual'
    },
    {
        policyNum: 2,
        premium: 30000,
        sumAssured: 1500000,
        policyTerm: '10 years',
        frequency: 'Semi-annual'
    },
    {
        policyNum: 3,
        premium: 40000,
        sumAssured: 2000000,
        policyTerm: '15 years',
        frequency: 'Quarterly'
    },
    {
        policyNum: 4,
        premium: 25000,
        sumAssured: 1200000,
        policyTerm: '7 years',
        frequency: 'Monthly'
    },
    {
        policyNum: 5,
        premium: 35000,
        sumAssured: 1800000,
        policyTerm: '12 years',
        frequency: 'Annual'
    },
    {
        policyNum: 6,
        premium: 45000,
        sumAssured: 2500000,
        policyTerm: '20 years',
        frequency: 'Annual'
    },
    // Policies for non-smokers
    {
        policyNum: 7,
        premium: 15000,
        sumAssured: 800000,
        policyTerm: '3 years',
        frequency: 'Annual'
    },
    {
        policyNum: 8,
        premium: 20000,
        sumAssured: 1200000,
        policyTerm: '5 years',
        frequency: 'Semi-annual'
    },
    {
        policyNum: 9,
        premium: 25000,
        sumAssured: 1500000,
        policyTerm: '7 years',
        frequency: 'Quarterly'
    },
    {
        policyNum: 10,
        premium: 18000,
        sumAssured: 1000000,
        policyTerm: '4 years',
        frequency: 'Monthly'
    },
    {
        policyNum: 11,
        premium: 23000,
        sumAssured: 1300000,
        policyTerm: '6 years',
        frequency: 'Annual'
    },
    {
        policyNum: 12,
        premium: 28000,
        sumAssured: 1800000,
        policyTerm: '8 years',
        frequency: 'Annual'
    }
];
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Insurance API',
            describtion: 'API for managing users and policies',
            contact: {
                name: "Spatika"
            },
            servers:["http://localhost:3000"]
        }
    },
    apis: ["server.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Log in a user
 *      parameters:
 *          - name: body
 *            in: body
 *            description: User credentials
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  mail:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *              description: Successful login
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal Server Error
 */

// Find the user in the database
app.post("/login", (req, res) => {
    const { mail, password } = req.body;
    
    // Find the user in the database
    users.findOne({ mail, password })
        .then(user => {
            if (!user) {
                // User not found or invalid credentials
                return res.status(401).json({ error: "Invalid email or password" });
            }
    
            // Generate a JWT token
            const token = jwt.sign({ _id: user._id }, secretKey);

            // Send the token and user data as response
            res.status(200).json({ token, user });
        })
        .catch(error => {
            console.error("Error logging in:", error);
            res.status(500).json({ error: "Internal server error" });
        });
});

// CRUD OPERATIONS 
// Create a new user with an id.
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             gender:
 *               type: string
 *             isSmoke:
 *               type: boolean
 *             isDiabetic:
 *               type: boolean
 *             incomePerAnnum:
 *               type: integer
 *             mail:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             gender:
 *               type: string
 *             isSmoke:
 *               type: boolean
 *             isDiabetic:
 *               type: boolean
 *             incomePerAnnum:
 *               type: integer
 *             mail:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.post('/register', (req, res) => {
    const newUser = req.body;
    // newUser.password = undefined;
    createUserInDatabase(newUser)
        .then(createdUser => {
            res.send(`User with the name ${createdUser.name} added to the database`);
        })
        .catch(error => {
            res.status(500).send('Error creating user: ' + error.message);
        });
});
function createUserInDatabase(newUser) {
    const userId = uuidv4();
    newUser.id = userId;
    return users.create(newUser);
}
// Read all users
app.get('/users', function (req, res) {
    users.find({})
    .then(user => {
        res.send(user);
    }) 
    .catch(error => {
        res.send('Error fetching users: '+ error.message);
    })
});

// Get a user by it's id.
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Updated user data
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    users.find({ _id: id })
        .then(foundUser => {
            if (foundUser) {
                res.send(foundUser);
            } else {
                res.status(404).send("User not found");
            }
        })
        .catch(error => {
            res.status(500).send('Error fetching user: ' + error.message);
        });
});
// Update user details by it's id.
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updateUser = req.body;

    updateUserInDatabase(userId, updateUser)
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }
            res.send(updatedUser);
        })
        .catch(error => {
            res.status(500).send('Error updating user: '+ error.message);
        });
});
function updateUserInDatabase(userId, updateUser) {
    return users.findOneAndUpdate(
        { _id: userId }, 
        { $set: updateUser }, 
        { new: true } 
    );
}
// Delete a udser by it's id.
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    deleteUserFromDatabase(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send('User not found');
            }
            res.send('User deleted successfully');
        })
        .catch(error => {
            res.status(500).send('Error deleting user: '+ error.message);
        });
});
function deleteUserFromDatabase(userId) {
    return users.findOneAndDelete({ _id: userId });
}

//create a policy.
/**
 * @swagger
 * /createpolicy:
 *   post:
 *     summary: Create a new policy
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Policy data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             policyNum:
 *               type: number
 *             premium:
 *               type: number
 *             sumAssured:
 *               type: number
 *             policyTerm:
 *               type: string
 *             policyFrequency:
 *               type: string
 *     responses:
 *       200:
 *         description: Policy created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

app.post('/createpolicy', (req,res) =>{
    const newPolicy = req.body;
    createPolicyInDatabase(newPolicy)
    .then(createdPolicy =>{
        res.send(`Policy with number ${createdPolicy.policyNum} added to the database`)
    })
    .catch(error => {
        res.status(500).send('Error creating policy: '+ error.message);
    });
});
function createPolicyInDatabase(newPolicy) {
    const policyId = uuidv4();
    newPolicy.id  = policyId;
    return Policy.create(newPolicy);
}
//Policy Issuance
/**
 * @swagger
 * /policy:
 *   post:
 *     summary: Get suggested policy based on user data
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             age:
 *               type: integer
 *             gender:
 *               type: string
 *             isSmoke:
 *               type: boolean
 *             isDiabetic:
 *               type: boolean
 *             incomePerAnnum:
 *               type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *     properties:
 *       policyNum:
 *         type: number
 *       premium:
 *         type: number
 *       sumAssured:
 *         type: number
 *       policyTerm:
 *         type: string
 *       policyFrequency:
 *         type: string
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal Server Error
 */
app.post("/policy", async (req, res) => {
    try {
        const { name, age, gender, isSmoke, isDiabetic, incomePerAnnum } = req.body;

        let suggest = '';
        if (isSmoke) {
            if (age < 30) {
                suggest = (incomePerAnnum < 200000) ? '' : (incomePerAnnum < 600000) ? '1' : (incomePerAnnum < 1200000) ? '2' : '3';
            } else if (age < 60) {
                suggest = (incomePerAnnum < 200000) ? '' : (incomePerAnnum < 600000) ? '4' : (incomePerAnnum < 1200000) ? '5' : '6';
            }
        } else {
            if (age < 30) {
                suggest = (incomePerAnnum < 200000) ? '' : (incomePerAnnum < 600000) ? '7' : (incomePerAnnum < 1200000) ? '8' : '9';
            } else if (age < 60) {
                suggest = (incomePerAnnum < 200000) ? '' : (incomePerAnnum < 600000) ? '10' : (incomePerAnnum < 1200000) ? '11' : '12';
            }
        }
        if (!suggest) {
            return res.send('No policy');
        }

        const suggestedPolicy = await Policy.findOne({ policyNum: suggest });

        if (!suggestedPolicy) {
            return res.status(404).send('Policy not found');
        }

        res.status(200).json({ suggestedPolicy });
    } catch (error) {
        res.status(500).send('Error finding policy: ' + error.message);
    }
});
// Homepage
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to the API
 */
app.get('/', (req, res) => {
    res.send('Welcome!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});