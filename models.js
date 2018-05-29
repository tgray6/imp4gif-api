'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const itemSchema = mongoose.Schema({
	// id: {type: String, required: true},
	author: {type: String, required: true},
	title: {type: String, required: true},
	type: {type: String, required: true},
	url: {type: String, required: true},
	comments: {type: Array, required: true},
	created: {type: Date, default: Date.now},
});

itemSchema.methods.serialize = function() {
	return {
		id: this._id,
		author: this.nickName,
		// author_id: this.nickName_id,
		title: this.title,
		type: this.type,
		url: this.url,
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
//   firstName: {type: String},
//   lastName: {type: String}
// });



//remember, behind the scenes, the database will be db.reviews., all lowercase and plural
const Items = mongoose.model('items', itemSchema);



module.exports = {Items};