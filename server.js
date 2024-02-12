const dotenv = require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const connect = require('./database/db.js');
const users = require('./models/users.js');

const app = express();

app.use(express.json());
connect();

const { v4: uuidv4 } = require('uuid');

let USERS= [
{
    name:'Spatika',
    age: 21,
    isSmoke: true,
    isDiabetic: false,
    incomePerAnnum: 500000,
    id: '1b892a53-l310-4347-b350-14c017fe0872'
},
{
    name:'Lucky',
    age: 49,
    isSmoke: false,
    isDiabetic: false,
    incomePerAnnum: 900000,
    id: '1b772a93-f318-4347-b350-14d917fe0892'
},
{
    name:'Nipun',
    age: 30,
    isSmoke: false,
    isDiabetic: true,
    incomePerAnnum: 1000000,
    id: '1d772x53-f318-4347-b350-14f017fe0018'
}
];

let policies = [
    // Policies for smokers
    {
        policyNum: '1',
        premium: '20000',
        sumAssured: '1000000',
        policyTerm: '5 years'
    },
    {
        policyNum: '2',
        premium: '30000',
        sumAssured: '1500000',
        policyTerm: '10 years'
    },
    {
        policyNum: '3',
        premium: '40000',
        sumAssured: '2000000',
        policyTerm: '15 years'
    },
    {
        policyNum: '4',
        premium: '25000',
        sumAssured: '1200000',
        policyTerm: '7 years'
    },
    {
        policyNum: '5',
        premium: '35000',
        sumAssured: '1800000',
        policyTerm: '12 years'
    },
    {
        policyNum: '6',
        premium: '45000',
        sumAssured: '2500000',
        policyTerm: '20 years'
    },
    // Policies for non-smokers
    {
        policyNum: '7',
        premium: '15000',
        sumAssured: '800000',
        policyTerm: '3 years'
    },
    {
        policyNum: '8',
        premium: '20000',
        sumAssured: '1200000',
        policyTerm: '5 years'
    },
    {
        policyNum: '9',
        premium: '25000',
        sumAssured: '1500000',
        policyTerm: '7 years'
    },
    {
        policyNum: '10',
        premium: '18000',
        sumAssured: '1000000',
        policyTerm: '4 years'
    },
    {
        policyNum: '11',
        premium: '23000',
        sumAssured: '1300000',
        policyTerm: '6 years'
    },
    {
        policyNum: '12',
        premium: '28000',
        sumAssured: '1800000',
        policyTerm: '8 years'
    }
];

//CRUD OPERATIONS 
// Create a new user with an id.
// app.post('/users', (req, res) => {
//     const newUser = req.body;
//     USERS.push({ ...newUser, id: uuidv4() });
//     res.send(`User with the name ${newUser.name} added to the database`);
// });
app.post('/users', (req, res) => {
    const newUser = req.body;
    createUserInDatabase(newUser)
        .then(createdUser => {
            res.send(`User with the name ${createdUser.name} added to the database`);
        })
        .catch(error => {
            res.status(500).send(error.message);
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
        res.send(error);
    })
});
// Get a user by it's id.
// app.get('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const foundUser = USERS.find((user) => user.id ==id );
//     res.send(foundUser);
// });
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
            res.status(500).send(error.message);
        });
});
// Update user details by it's id.
// app.put('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     const updateUser = req.body;
//     const index = USERS.findIndex(user => user.id === userId);
//     if (index === -1) {
//         return res.status(404).send('User not found');
//     }
//     USERS[index] = { ...USERS[index], ...updateUser };
//     res.send(USERS[index]);
// });
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updateUser = req.body;

    // Update user details asynchronously
    updateUserInDatabase(userId, updateUser)
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }
            res.send(updatedUser);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});
function updateUserInDatabase(userId, updateUser) {
    return users.findOneAndUpdate(
        { _id: userId }, 
        { $set: updateUser }, 
        { new: true } 
    );
}

// Delete a user by it's id.
// app.delete('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     const index = USERS.findIndex(user => user.id === userId);
//     if (index === -1) {
//         return res.status(404).send('User not found');
//     }
//     const deletedUser = USERS.splice(index, 1);
//     res.send(deletedUser);
// });
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
            res.status(500).send(error.message);
        });
});
function deleteUserFromDatabase(userId) {
    return users.findOneAndDelete({ _id: userId });
}

app.post("/policy", (req, res) => {
    const { name, age, isSmoke, isDiabetic, incomePerAnnum } = req.body;

    //validate rules
    if (!name || typeof isSmoke !== 'boolean' || typeof isDiabetic !== 'boolean') {
        return res.status(400).send('Invalid request body');
    }

    if(isSmoke){
        if(age<30){
            if(incomePerAnnum < 200000) res.send('No policy');
            else if(incomePerAnnum >= 200000 && incomePerAnnum <600000) suggest = '1';
            else if(incomePerAnnum >=600000 && incomePerAnnum < 1200000) suggest = '2';
            else suggest = '3';
        } 
        else if(age<60) {
            if(incomePerAnnum < 200000) res.send('No policy');
            else if(incomePerAnnum >= 200000 && incomePerAnnum <600000) suggest = '4';
            else if(incomePerAnnum >=600000 && incomePerAnnum < 1200000) suggest = '5';
            else suggest = '6';
        }
        else res.send('No Policy');
    }
    else{
        if(age<30){
            if(incomePerAnnum < 200000) res.send('No policy');
            else if(incomePerAnnum >= 200000 && incomePerAnnum <600000) suggest = '7';
            else if(incomePerAnnum >=600000 && incomePerAnnum < 1200000) suggest = '8';
            else suggest = '9';
        } 
        else if(age<60) {
            if(incomePerAnnum < 200000) res.send('No policy');
            else if(incomePerAnnum >= 200000 && incomePerAnnum <600000) suggest = '10';
            else if(incomePerAnnum >=600000 && incomePerAnnum < 1200000) suggest = '11';
            else suggest = '12';
        }
        else res.send('No policy');
    }
    const suggestedPolicy = policies.find(policy => policy.policyNum === suggest);
    console.log(suggestedPolicy);
    if (!suggestedPolicy) {
        return res.status(404).send('Policy not found');
    }

    res.send(suggestedPolicy);
});

app.get('/', (req, res) => {
    res.send('Welcome to my Express.js server!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});