const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
var o = require('odata');
//var odataEndpoint = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
o().config({
    endpoint: 'http://services.odata.org/V4/Northwind/Northwind.svc/', // The default endpoint to use.
    format: 'json', // The media format. Default is JSON.
    autoFormat: true, // Will always append a $format=json to each query if set to true.
    version: 4, // currently only tested for Version 4. Most will work in version 3 as well.
    strictMode: true, // strict mode throws exception, non strict mode only logs them
    start: null, // a function which is executed on loading
    ready: null, // a function which is executed on ready
    error: null, // a function which is executed on error
    headers: [], // an array of additional headers [{name:'headername',value:'headervalue'}]
    username: null, // the basic auth username
    password: null, // the basic auth password
    isAsync: true, // set this to false to enable sync requests. Only usable without basic auth
    isCors: true, // set this to false to disable CORS
    isHashRoute: true, // set this var to false to disable automatic #-hash setting on routes
    appending: '' // set this value to append something to a any request. eg.: [{name:'apikey', value:'xyz'}]
});
/* GET home page. */
app.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Sridevi Local system'
    });
});
app.post('/odata', odataEntitySet);

function odataEntitySet(req, res) {
    o("").get(function (data) {
        var buttonsArry = []
        for (var i = 0; i < data.length; i++) {
            btnObject = {
                title: data[i].name
                , value: data[i].url
            }
            buttonsArry.push(btnObject);
        }
        var response = {
            type: 'quickReplies'
            , content: {
                title: 'You can use following options'
                , buttons: buttonsArry
            }
        }
        res.json({
            replies: [response]
        });
    }, function (status) {
        console.log(status);
        res.json(status);
    });
}
app.post('/odata/:entity', function (req, res, next) {
    o(req.params.entity).get(function (data) {
        res.json(data);
    }, function (status) {
        res.json(status);
        console.error(status); // error with status
    });
});
app.post('/get/Employees', function (req, res) {
    o('Employees').get(function (data) {
        var ListArry = []
        for (var i = 0; i < data.length; i++) {
            listObject = {
                title: data[i].FirstName + " " + data[i].LastName
                , subtitle: data[i].Title
                , buttons: [{
                        title: data[i].FirstName + " " + data[i].LastName
                        , value: "Get the details of employee " + data[i].EmployeeID
          }
        ]
            }
            ListArry.push(listObject);
        }
        var response = {
            type: 'list'
            , content: {
                elements: ListArry
            }
        }
        res.json({
            replies: [response]
        });
    }, function (status) {
        res.json(status);
        console.error(status); // error with status
    });
});
app.post('/get/EmployeeDetails', function (req, res) {
    var empId = req.body.conversation.memory.empid.scalar;
    console.log(empId);
    o('Employees(' + empId + ')').get(function (data) {
        var response = {
            type: 'card'
            , content: {
                title: data.FirstName + " " + data.LastName
                , imageUrl: ''
                , subtitle: data.Notes
                , buttons: [{
                    title: data.HomePhone
                    , type: 'phone'
                    , value: data.HomePhone
      }]
            }
        }
        console.log(response);
        res.json({
            replies: [response]
        });
    }, function (status) {
          res.json({
      replies: [{ type: 'text', content: `No employee found.` }],
    }); // error with status
    });
});
app.post('/errors', function (req, res) {
    console.error(req.body);
    res.sendStatus(200);
});
module.exports = app;