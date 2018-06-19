const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
mongoose.Promise = global.Promise;
// const PORT = process.env.PORT || 3000;

const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const { PORT, DATABASE_URL } = require('./config');
const { Items } = require('./models');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public'));
app.use(morgan('common'));



//USERS AND AUTHENTICATION
const passport = require('passport');

//JSON WEB TOKEN AUTH
const jwtAuth = passport.authenticate('jwt', { session: false });

//USER MODEL DATA
const {User} = require('./models');

//USERS ROUTER data
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
app.use('/users', usersRouter);
app.use('/auth', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);






app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});




//GET
app.get('/items', jwtAuth, (req, res) => {
	Items
		.find()
		.sort({'created': 'desc'})
		.then(items => {
  			res.json({
  				items: items.map(
  					(items) => items.serialize())
  			});
		})
		.catch(err =>{
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error'})
		});
});




//POST
app.post('/items/', jwtAuth, (req, res) => {
	Items
		.create({
			"title": req.body.title,
			"type": req.body.type,
			"youTubeUrl": req.body.youTubeUrl,
			"url": req.body.url,
			"author": req.body.author,
			"authorid": req.user.userID,
			"comments": req.body.comments
		})
		
		.then(items => res.status(201).json(items.serialize()))
		.catch(err =>{
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error'})
		});
});




//PUT ENDPOINT
app.put('/items/:id', jwtAuth, (req, res) => {
  Items
    .findByIdAndUpdate(req.params.id,
    	{
    		$push: {comments: req.body.comment},
    	}, 
    	{
    		"new": true
    	}
    )
    .then(updatedItem => {if (updatedItem != null)
      return res.status(200).json(updatedItem.serialize())})
    .catch(err => {
    	console.error(err);
    	res.status(500).json(err)
    });
});





//DELETE
app.delete('/items/:id', jwtAuth, (req, res) => {
  Items
  	.findByIdAndRemove(req.params.id, (err, postId) => {

  	if (err) return res.status(500).send(err);

  	const response = {
  		message: "Item Successfully Deleted",
  		id: postId._id
  	};

  	return res.status(200).send(response);
  });
});





let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}



module.exports = {app, runServer, closeServer};