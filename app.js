const express = require('express');
const app = express();
const cors = require('cors');
const dotenv= require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))

//add
app.post('/insert', (request, response)=> {
    const { input } = request.body;
    const result = dbService.insertNewData(input);

    result
        .then(data => response.json({ data: data}))
        .catch(err => console.log(err));
});
//read
app.get('/getAll', (request, response) => {

    const result =dbService.getAllData();

    result
        .then(data => response.json({data : data}))
        .catch(err => console.log(err));
})
//update
app.patch('/update', (request, response) => {
    const { id, category , name} = request.body;


    const result = dbService.updateDataById(id, category, name);

    result
        .then(data => response.json({success : data}))
        .catch(err => console.log(err));
});
//search
app.get('/search/:category/:input', (request, response) => {
    const { input } = request.params;
    const { category } = request.params;

    const result = dbService.searchByCat(input, category);

    result
        .then(data => response.json({data : data}))
        .catch(err => console.log(err));
})

// delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = dbService.deleteRowById(id);

    result
        .then(data => response.json({success : data}))
        .catch(err => console.log(err));
});

app.get('/search/:category/:input', (request, response) => {
    const { input } = request.params;
    const { category } = request.params;


    const result = dbService.searchByCat(input, category);

    result
        .then(data => response.json({data : data}))
        .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));