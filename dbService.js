let mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();
let connection = mysql.createConnection({
    host:  process.env.HOST,
    user:  process.env.USER,
    password:  process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err)=> {
    if (err){
        console.log(err.message);
    }
    console.log('db ' + connection.state);
})

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DBService();
    }

    async getAllData(){
        try{
            //console.log(response)
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM loonaisland.resident;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

        }catch(error){
            console.log(error)
        }
    }
}
async function insertNewData(input) {
    try {
        const insertId = await new Promise((resolve, reject) => {
            const query = "INSERT INTO resident (resident_name) VALUES (?);";

            connection.query(query, [input] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.insertId);
            })
        });
        return {
            id : insertId,
            input : input
        };
    } catch (error) {
        console.log(error);
    }
}

async function deleteRowById(id) {
    try {
        id = parseInt(id, 10);
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM names WHERE id = ?";

            connection.query(query, [id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            })
        });

        return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateDataById(id, category, name) {
    try {
        id = parseInt(id, 10);
        const response = await new Promise((resolve, reject) => {
            const query = "UPDATE resident SET ? = ? WHERE id = ?";

            connection.query(query, [category, name, id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            })
        });

        return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function searchByCat(input, category){
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM resident WHERE ? = ?;";

            connection.query(query, [ category, input], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            })
        });

        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = DbService;