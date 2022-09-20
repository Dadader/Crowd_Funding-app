const query = `
CREATE TABLE IF NOT EXISTS Users (
    first_name VARCHAR(50) ,
    last_name VARCHAR(50) ,
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(150) ,
    token VARCHAR(100) 
)`;

module.exports = query;
