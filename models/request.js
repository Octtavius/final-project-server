// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var requestSchema = new Schema({
    socketId: String,
    carId: String,
    // username: { type: String, required: true, unique: true },
    requestedOn: { type: Date, default: Date.now },
    canceledByUser: { type: Boolean, default: false },
    staffAcceptedRequest: { type: Boolean, default: false },
    assistanceProvided: { type: Boolean, default: false },
    assistanceProvidedOn: { type: Date, default: null },
    staffCanceled: { type: Boolean, default: false },
    staffArrived: { type: Date, default: null }
});

// the schema is useless so far
// we need to create a model using it
var Request = mongoose.model('Request', requestSchema);

// make this available to our users in our Node applications
module.exports = Request;