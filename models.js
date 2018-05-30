'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const itemSchema = mongoose.Schema({
	// id: {type: String, default: uuidv1},
	title: {type: String, required: true},
	type: {type: String, required: true},
	youTubeUrl: {type: String, required: false},
	url: {type: String, required: true},
	author: {type: String, required: true},
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
		comments: this.comments,
		created: this.created
	};
};


//USER SCHEMA
// const UserSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   nickName: {type: String}
// });



//remember, behind the scenes, the database will be db.items., all lowercase and plural
const Items = mongoose.model('items', itemSchema);



module.exports = {Items};