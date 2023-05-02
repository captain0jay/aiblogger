const mongoose = require('mongoose');
//const Blog = require('./Models/blog')
const connectdb = require('./db/connect');
const blogModel = require('./Models/blog');
const refblogModel = require('./Models/refblog');
const uri = "";

connectdb(uri);

//uploads fetched rssfeed data to blog database
async function createBlog(link,title,creator,description){//,date){
    var blogmodel = new blogModel({link : link,title : title,category : creator,description : description});//,date : date});
    blogmodel.save()
    .then(() => console.log('blog inserted'))
    .catch(err => console.log(err));
}

//fetches data from blog database one by one
async function getblog(redislink){
    try {
        const blogdata = await blogModel.find({ link: redislink });
        console.log('blog fetched');
        return blogdata;
      } catch (err) {
        console.log(err);
        return null; // or throw an error if you want to handle errors higher up the call stack
      }
}

//uploads fetched rssfeed data to blog database
async function createrefBlog(link,title,creator,description,content){
    var refblogmodel = new refblogModel({link : link,title : title,category : creator,description : description,content : content});//,date : date});
    refblogmodel.save()
    .then(() => console.log('refblog inserted'))
    .catch(err => console.log(err));
}

module.exports = {createBlog,getblog, createrefBlog};