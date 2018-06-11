'use strict';

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:9999';
// exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://imp4gif.netlify.com/';



exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/imp4gif';
// exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://tgray6:sagesage1@ds239940.mlab.com:39940/imp4gif';




exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://tgray6:sagesage1@ds239940.mlab.com:39940/imp4gif-test';
exports.PORT = process.env.PORT || 8888;



exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';