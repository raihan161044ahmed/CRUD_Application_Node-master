var Userdb = require("../model/model");
const fs = require( 'fs' );
const { Parser } = require('json2csv');
const path = require('path');
const axios = require( 'axios' );


// Helper function to convert data to CSV format
function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(user => Object.values(user).join(',')).join('\n');
  return headers + rows;
}

// create and save new user
exports.create = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be emtpy!" });
    return;
  }

  // new user
  const user = new Userdb({
    title: req.body.title,
    article_body: req.body.article_body,
    author: req.body.author,
    publish_date: req.body.publish_date,
    category: req.body.category,
  });

  // save user in the database
  user
    .save(user)
    .then((data) => {
      //res.send(data)
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating a create operation",
      });
    });
};

// retrieve and return all users/ retrieve and return a single user
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Userdb.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found user with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error retrieving user with id " + id });
      });
  } else {
    Userdb.find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error Occurred while retrieving user information",
        });
      });
  }
};

// Update a new identified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const id = req.params.id;
  Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user information" });
    });
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Userdb.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Search users based on title, author, or category
exports.search = (req, res) => {
  const searchQuery = req.body.searchQuery;

  Userdb.find({
    $or: [
      { title: { $regex: searchQuery, $options: "i" } },
      { author: { $regex: searchQuery, $options: "i" } },
      { category: { $regex: searchQuery, $options: "i" } },
    ],
  })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: "Error occurred while searching users",
      });
    });
};

exports.backupData = (req, res) => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        const data = response.data;
  
        // Set the response headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=users.json');
  
        // Write the data to a file
        const filePath = path.join(__dirname, '../data_backup.json');
        fs.writeFile(filePath, JSON.stringify(data), err => {
          if (err) {
            console.error('Error occurred while creating backup:', err);
            return res.status(500).send('Error occurred while creating backup');
          }
  
          // Send the file as the response
          res.sendFile(filePath, err => {
            if (err) {
              console.error('Error occurred while sending file:', err);
              res.status(500).send('Error occurred while sending file');
            }
  
            // Remove the temporary backup file
            fs.unlinkSync(filePath);
          });
        });
      })
      .catch(error => {
        console.error('Error occurred while fetching data:', error);
        res.status(500).send('Error occurred while fetching data');
      });
  };