'use strict';
const sticky = require('sticky-session');
const cluster = require('cluster');

module.exports = {
    //cluster sticky-session url
    clusterStickySession:async (http, appPort) => {
      try{
          if (!sticky.listen(http, appPort)) {

              http.once('listening', function () {
                console.log('Server started on port ' + appPort);
              });
            
              if (cluster.isPrimary) {
            
                var numWorkers = require('os').cpus().length;
            
                // console.log('Master cluster setting up ' + numWorkers + ' workers...');
            
                for (var i = 0; i < 1; i++) {
                  cluster.fork();
                }
                // console.log('Main server started on port ' + appPort);
            
                cluster.on('online', function (worker) {
                  // console.log('Worker ' + worker.process.pid + ' is online');
                });
              }
          }
      }catch(err){
        console.log(err, "-err")
      }
    },
}