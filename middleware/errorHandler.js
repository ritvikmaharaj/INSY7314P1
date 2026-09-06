
// err used to define error taken from another route or middleware
// req is for a request for the incoming http request object
// res is for a response that gets send to the client
const errorHandler = (err, req, res, next) => { 

    console.error(err.message);

    res.status(500).json({ 

    error: 'An error has occurred.' 

  }); 

}; 
//make the function accessable from other files
module.exports = errorHandler; 
