/**
 * Makes a public http endpoint for fetching predictions from ML Engine.
**/

const { google } = require('googleapis');
const machinelearning = google.ml('v1');

exports.getPrediction = (req, res) => {
  
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    //respond to CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
      return;
    }

    google.auth.getApplicationDefault( (err, authClient, projectId) => {

        if (err) {
          
            console.log('Authentication failed because of ', err);
            res.status(401).send('Authentication failed');
          
        } else {
          
          const name = 'projects/' + projectId + '/models/' + req.body.model;
          
          console.log('getting prediction from ' + name);
          

            var mlRequest = {
                'auth': authClient,
                'name': name,
                'resource': {'instances' : req.body.instances}
            }
            
            machinelearning.projects.predict(mlRequest, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).send('whoops, something broke, does that model exist?');
                } else {
                    res.status(200).send(JSON.stringify(result.data, null, 2));
                }
            });
        } 
    });
};