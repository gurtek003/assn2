/******************************************************************************
***
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ___Gurtek Singh Sasan__ Student ID: __N01576208____ Date: ___2023-11-03___
*
*
******************************************************************************
**/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var path = require('path');
var app = express();
const exphbs = require('express-handlebars');
const port = process.env.port || 3000;
const fs = require('fs');
const bodyParser = require('body-parser');

var Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('checkBlank', function(value) {
  return value === '' ? 'unknown' : value;
});




app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
app.get('/users', function(req, res) {
  res.send('respond with a resource');
});





// Step 5 Loading data
app.get('/alldata', (req, res) => {
  fs.readFile('./ite5315-A1-supermarket_sales.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('An error occurred while loading the JSON data.');
      }
      res.render('alldata', {data: data});
  });
});


// Step 6 Displaying invoiceid br record number
app.get('/data/invoiceID/:index', (req, res) => {
  const index = req.params.index;
  fs.readFile('./ite5315-A1-supermarket_sales.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('An error occurred while loading the JSON data.');
      }
      const jsonData = JSON.parse(data);
      const storeSales = jsonData.storeSales;
      if (index < 0 || index >= storeSales.length) {
          return res.status(404).send('Invalid index.');
      } else if (storeSales[index]) {
          return res.render('invoiceID', {invoiceID: storeSales[index].InvoiceID});
      }
  });
});





//Step6(2) Getting Invoice id from user and Displaying storesales
const data = require('./ite5315-A1-supermarket_sales.json');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/search/invoiceID', (req, res) => {
  res.render('searchInvoiceID');
});




app.post('/search/invoiceID', (req, res) => {
  const invoiceID = req.body.invoiceID;
  const storeSales_info = data.storeSales.find(d => d.InvoiceID === invoiceID);
  res.render('invoiceIDResults', {storeSales_info: storeSales_info});
});



//Step7Using Productline displaying records

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/search/productLine', (req, res) => {
  res.render('searchProductLine');
});


app.post('/search/productLine', (req, res) => {
  const productLine = req.body.productLine;
  const storeSales_info = data.storeSales.filter(d => d.productLine.includes(productLine));
  res.render('productLineResults', {storeSales_info: storeSales_info});
});



app.get('/allDatas', function(req, res) {
  // Read the JSON file
  fs.readFile('./ite5315-A1-supermarket_sales.json', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).send('Error reading file');
      return;
    }

    // Parse the JSON data
    var salesData = JSON.parse(data);

    // Prepare data for the view
    var viewData = {
      headers: Object.keys(salesData.storeSales[0]),
      storeSales: salesData.storeSales
    };

    // Render the view with the data
    res.render('sales', viewData);
  });
});


app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

app.listen(HTTP_PORT);