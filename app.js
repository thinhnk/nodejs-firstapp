/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var employeeProvider = new EmployeeProvider('localhost', 27017);

//Routes

app.get('/', function (req, res) {
    employeeProvider.findAll(function (error, emps) {
        res.render('index', {
            title: 'Employees',
            employees: emps
        });
    });
});

app.get('/employee/new', function (req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee -- l�u employee
app.post('/employee/new', function (req, res) {
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function (error, docs) {
        res.redirect('/')
    });
});

// view update an employee
app.get('/employee/edit', function (req, res) {
    var employeeID = req.param('_id');
    employeeProvider.getByID(employeeID, function (error, employee) {
        console.log(employee);
        res.render('employee_edit', {
            employee: employee
        });


    });

});

app.post('/employee/edit', function (req, res) {
    var employeeID = req.param('_id');
    var title = req.param('title');
    var name = req.param('name');
    employeeProvider.update(employeeID, {title: title, name: name}, function (error, docs) {
        res.redirect('/');
    });
});


app.post('/employee/delete', function (req, res) {
    var employeeID = req.param('_idEm');
    employeeProvider.delete(employeeID, function(error, docs){
        res.redirect('/');
    });
});


app.listen(3000);