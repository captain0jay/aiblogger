const express = require('express');
const app = express();
var cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default:fetch})=> fetch(...args));
var bodyParser = require('body-parser');
const schedule = require('node-schedule');
const { rssextractor } = require('./rssfeeds/rssextractor.js')
const { mainfunc } = require('./rssfeeds/chatgpt.js')



const CLIENT_ID=""
const CLIENT_SECRET=""
const REDIRECT_URL = "http://localhost:3000/"
//const tokan = typeof window !== 'undefined' ? localStorage.getItem('access_tokenn') : null
//const upload = multer({dest:'filefold/'});[fa-failed attempt]

//app.use(express.static('/public'))
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
//app.use(Upload())//[fa-failed attempt]
//let flag = true;
async function jobdoer(){
    schedule.scheduleJob('*/1 * * * *', async function(){
        try {
            await rssextractor();      
            await mainfunc();
             
        } catch (error){
            console.log(error);
        } 
    });
    
}
app.listen(4000,function(){
    //const job = schedule.scheduleJob('* * * * *', jobdoer);
    //job.nextInvocation();\
    jobdoer();
    //x=1;
    //while(x==1){
    //console.log('runnin.....',rssextractor.nextInvocation());
    //rssextractor();
    //}
    console.log("listening......");
});
