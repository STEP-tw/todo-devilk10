let http = require('http');
let app = require('./app.js');
let server = http.createServer(app);
const PORT = 5000;
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
