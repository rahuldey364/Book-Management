const express = require('express');
const bodyPaser = require('body-parser');
const route = require('./routes/route.js');
const { default : mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyPaser.json());
app.use(bodyParser.urlencoded({ extended : true }));

mongoose.connect("mongodb+srv://disha123:hl6LMcJIED1eCZhr@cluster0.hrerz.mongodb.net/project3", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))   // it passes the function when the promises gets resolved
.catch ( err => console.log(err) )

// app.use (
//     function (req, res, next) {
//         console.log ("inside GLOBAL MW");
//         next();
//   }
//   );
// console.log(5)
app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
