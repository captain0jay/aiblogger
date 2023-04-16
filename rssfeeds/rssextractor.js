const fs = require("fs");
const Parser = require("rss-parser");
const cron = require('node-cron');//runs endlessly by just using'require(./rssextractor.js)' in server.js
const schedule = require('node-schedule');
const rp = require('request-promise');
const { createBlog } = require('./mongodbsaver');
//const client = require('../server');
const Redis = require('redis');
//const client = Redis.createClient(6380,'127.0.0.1');
const client = Redis.createClient({port:6380});
//redis-server --port 6380 --slaveof 127.0.0.1 6379

async function rssextractor(){
    console.log("hi")
    url=["https://screenrant.com/feed/",
    "https://www.cinemablend.com/feeds.xml",
    "https://movieweb.com/feed/",
    "https://www.comingsoon.net/feed"]
    let x=0;
    while(x<4){
    const parser = new Parser();
    const feed = await parser.parseURL(url[x]);
    //console.log(feed)
    console.log(feed.items[0].link);
    x++;
    p=0;
    //let feed.items[p].link="def";
    while(feed.items[p]!== undefined){
        //if(feed.items[p].link!=0){let feed.items[p].link = feed.items[p].link;}
        //else{let feed.items[p].link='default';p++; break}
        if (feed.items[p].link !== undefined) {
        console.log(feed.items[p].link);
        createBlog(feed.items[p].link,feed.items[p].title,feed.items[p].creator,feed.items[p].contentSnippet);//,uniqueDateTime);
        //await client.connect();
        //client.lPush('blogqueue', feed.items[p].link );
        addToQueue(feed.items[p].link);
        }
        p++;
    }
    }
    //await client.quit()
}
function addToQueue(data) {
    client.lpush('blogqueue', data, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Data added to the queue');
      }
      // Close the Redis client
      //client.quit();
    });
  }
//const job = schedule.scheduleJob('*/1 * * * *', rssextractor);

//module.exports = { rssextractor },client;
module.exports = {
    rssextractor
  };
