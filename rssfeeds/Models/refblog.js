const mongoose = require('mongoose');
const { Schema } = mongoose;

const refblogSchema = new Schema({
  link: { type: String,
          required: true },
  title: { type: String, 
           required: true},
  category: { type: String},
  description: { type: String, 
           required: true},
  content: { type: String, 
            required: true},
  //date: {type: integer,
         //required: true}
});

const refblogModel = mongoose.model('refBlog',refblogSchema)
module.exports = refblogModel;
//chatgpt:- const User = mongoose.model('User', userSchema);