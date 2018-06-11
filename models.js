'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// const uuidv1 = require('uuid/v1');

const itemSchema = mongoose.Schema({
	// id: {type: String, default: uuidv1},
	title: {type: String, required: true},
	type: {type: String, required: true},
	youTubeUrl: {type: String, required: true},
	url: {type: String, required: true},
	author: {type: String, required: true},
	// authorid: {type: String, required: true},
	comments: {type: Array, required: true},
	created: {type: Date, default: Date.now}
});

itemSchema.methods.serialize = function() {
	return {
		id: this._id,
		title: this.title,
		type: this.type,
		youTubeUrl: this.youTubeUrl,
		url: this.url,
		author: this.author,
		// authorid: this.authorid,
		comments: this.comments,
		created: this.created
	};
};

//remember, behind the scenes, the database will be db.items., all lowercase and plural
const Items = mongoose.model('items', itemSchema);


//USER SCHEMA
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {type: String}
});

UserSchema.methods.userserialize = function() {
	return {
		username: this.username,
		nickname: this.nickname,
		userID: this.id
	};
};


//BCRYPT PASSWORD VALIDATION AND HASHING
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('users', UserSchema);






module.exports = {Items, User};