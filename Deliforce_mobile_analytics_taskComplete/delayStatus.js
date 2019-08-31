let mongoose= require('mongoose');
const taskModel = require('./model').Task;
let _= require('lodash');
let query={$match:{}};

  module.exports= {
      delayCount: function (driverId,dateFilter) {

          let query= {"$match": {
          "$and": [
              {
              driver: mongoose.Types.ObjectId(driverId)
              },
              {
                  "taskStatus": 6
              },
              {
                  "delay": 0
              },
              {"date":dateFilter}
          ]
      }};
        return taskModel.aggregate([
             query,
            {
                $group : {
                    _id : null,
                    count: { $sum: 1 }
                }
            }


          ]).then((result) => {
              console.log('delay count',JSON.stringify(result));
              let finalOutput = 0;
              if (!_.isEmpty(result)) {
                 finalOutput=result[0].count;
              }

            return  Promise.resolve({ontimeCount:finalOutput})
          })
            .catch((err)=>{
               console.log('delaycountError',err);
            })
      }
  }