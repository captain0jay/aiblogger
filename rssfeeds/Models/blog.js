const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  link: { type: String,
          required: true },
  title: { type: String, 
           required: true},
  category: { type: String, 
          required: true},
  description: { type: String, 
           required: true},
  //date: {type: integer,
         //required: true}
});

const blogModel = mongoose.model('Blog',blogSchema)
module.exports = blogModel;
//chatgpt:- const User = mongoose.model('User', userSchema);