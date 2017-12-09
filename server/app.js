const express = require('express');
const mountRoutes = require('./routes');
const http = require('http');
const port = 3030;
const app = express();
mountRoutes(app);

const server = http.createServer(app);
	server.listen(port, (error) => {
	  if (error) {
	    console.error(error);
	  } else {
	    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
	  }
	});
