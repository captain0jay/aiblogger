//initialization
const Redis = require('redis');
//const client = Redis.createClient(6380,'127.0.0.1');
const client = Redis.createClient({port:6380});
//const client = require('./mongodbsaver');
const { getblog } = require('./mongodbsaver');
const { createrefBlog }  = require('./mongodbsaver');
const fetch = (...args) => import('node-fetch').then(({default:fetch})=> fetch(...args));
OPENAI_API_KEY = '';
const schedule = require('node-schedule');
const { Sema } = require('async-sema');

//main function
async function mainfunc(){
  //await client.connect();
//while(client.lpop('blogqueue')!==0){
  let j=0;
  while(j<10){
    mainting();
    j++;
  }
//}
//await client.quit();
}

//getting from blog database
let sentnc="default";
async function mainting(){
    //redis get dta from queue
    const redislink = await new Promise((resolve, reject) => {
      client.lpop('blogqueue', (err, item) => {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    });

    //chatgpt data retrieval
    console.log(redislink)
    const blogdata = await getblog(redislink);
    //console.log(blogdata)
    if(blogdata!==undefined){
    const gotprompt = await prompt(blogdata[0].link);
    console.log(gotprompt)
    const Tchatgptdata = await callChatGPTWithDelay(gotprompt);
    console.log(Tchatgptdata);
    //uploading on refinedblog database
    await createrefBlog(blogdata[0].link,blogdata[0].title,blogdata[0].creator,blogdata[0].description,Tchatgptdata.choices[0].message.content);
    }
    //delete from queue after successful completion
    await client.lrem('blogqueue', 1, redislink , (err, numRemoved) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${numRemoved} item(s) removed from the queue`);
        }
      });
}

//to reduce REQUEST/MIN AND INCREASE DELAY PURPOSEFULLY
const MAX_CONCURRENT_REQUESTS = 3;
const apiSemaphore = new Sema(MAX_CONCURRENT_REQUESTS);

//to reduce REQUEST/MIN AND INCREASE DELAY PURPOSEFULLY
async function callChatGPTWithDelay(gotprompt, delay = 10000) {
  await apiSemaphore.acquire();
  try {
    const chatgptdata = await chatgpt(gotprompt);
    return chatgptdata;
  } finally {
    apiSemaphore.release();
  }
}


//making prompt out of it
async function prompt(linknew){
    sentnc="Using the link, write me another blog having minimum of 300 words with the same content and facts but registered in a different order. Seperate them into different sections each having subheadings. Write me a new title too. link:- "+linknew;
    //sentnc="say hello!";
    return sentnc;
}

//fetching chat from chatgpt
async function chatgpt(promptdata){
  console.log(promptdata);
  console.log("runnin")
  await apiSemaphore.acquire();
  try{
    return new Promise(async (resolve, reject) => {
      try {
        // Your logic for calling the ChatGPT API
        // Example:
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method:"POST",
        headers:{
           "Content-Type" : 'application/json',
           "Authorization" : `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
            messages: [{role: 'system' , content: `${promptdata}`}],
            temperature:0,
        }),
        });
        const data = await response.json();
        console.log(data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })
  }finally{
    apiSemaphore.release();
  }
}
//job maker
//const job1 = schedule.scheduleJob('*/1 * * * *', mainfunc);

//exporting mainfunc function
module.exports = { mainfunc };