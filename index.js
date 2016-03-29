#!/usr/bin/env node
"use strict";
let helper=require('./helper')
let fs = require('fs').promise
let path=require('path')
let express = require('express')
let morgan = require('morgan')
let trycatch = require('trycatch')
let co = require('co')
let wrap = require('co-express')
let bodyParser = require('body-parser')

function* main(){

 let app =  express()

 //app.all('*', (req, res) => res.end('hello testing nodemon\n'))

 app.listen(3005, function () {
  console.log('Example app listening on port 3004!');
});


function* read(req, res) {
 let filePath=path.join('./','files',req.url)
 let data=yield fs.readFile(filePath)
 res.end(data);

 }
 function* create(req, res) {
console.log(req.url)
  let filePath = path.join(process.cwd(),'files',req.url)
  let data = yield fs.open(filePath, "wx")
  res.end();

 }

 function* update(req, res) {
  let filePath = path.join('./', 'files', req.url)
  let data = yield fs.writeFile(filePath, req.body)
  res.end()
 }

 function* remove(req, res) {
  let filePath = path.join('./', 'files', req.url)
  let data = yield fs.unlink(filePath)
  res.end()
 }

 app.get('*', wrap(read))
 app.put('*', wrap(create))
 app.post('*',wrap(update))
 app.del('*', wrap(remove))

console.log('Start the server')

 app.use(morgan('dev'))


app.use((req, res, next) => {

trycatch(next, e=> {

console.log(e.stack)

res.writeHead(500)
res.end(e.stack)

})

 })



}

module.exports = main
