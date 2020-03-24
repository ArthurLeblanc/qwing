let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./config/keys');

// Express Routes
const userRoute = require('./routes/user.route')
const proposRoute = require('./routes/propos.route')
const reponseRoute = require('./routes/reponse.route')
const categorieRoute = require('./routes/categorie.route')
const commentaireRoute = require('./routes/commentaire.route')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.mongoURI, {
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/api/users/', userRoute)
app.use('/api/propos/', proposRoute)
app.use('/api/reponses/', reponseRoute)
app.use('/api/categories/', categorieRoute)
app.use('/api/commentaires/', commentaireRoute)

// If no API routes are hit, send the React app
app.use(function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
  next(new Error('Not Found'));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});