const data = require('./data.json');
module.exports = (req, res) => {
    res.status(200);
    console.log(data);
    res.end(JSON.stringify(data));
};