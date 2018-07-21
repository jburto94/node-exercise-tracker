const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');

const User = require('./models/user');
const Exercise = require('./models/exercise');

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser({ urlencoded: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));

app.post('/api/exercise/new-user', (req, res, next) => {
  const user = new User(req.body);
  user.save((err, data) => {
    if(err) {
      return next(err);
    }
    res.json({
      username: data.username,
      _id: data._id
    });
  });
});

app.get('/api/exercise/users', (req, res, next) => {
  User.find({}, (err, data) => err ? next(err) : res.json(data));
});

app.post('/api/exercise/add', (req, res, next) => {
  User.findById(req.body.userId, (err, data) => {
    if(err) return next(err);

    if(!data) return res.send('Unknown id');

    if(!req.body.date) delete req.body.date;
    req.body.username = data.username;

    const newExercise = Exercise(req.body);
    newExercise.save((err, exercise) => {
      res.json({
        username: exercise.username,
        _id: data._id,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toString()
      });
    });
  });
});

app.get('/api/exercise/log', (req, res, next) => {
  User.findById(req.query.userId, (err, data) => {
    if(err) return next(err);
    if(!data) return next('User not found');

    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    Exercise.find({
      userId: data._id,
      date: { 
        $gte: !isNaN(from) ? from.getTime() : 0,
        $lt: !isNaN(to) ? to.getTime() : Date.now()
      }
    }, '-_id')
    .sort('-date')
    .limit(parseInt(req.query.limit))
    .select('description duration date')
    .exec((err, exercise) => {
      if(err) return res.send(err);

      const exercises = {
        usename: data.username,
        _id: data._id,
        from: !isNaN(from) ? from.toDateString() : undefined,
        to: !isNaN(to) ? to.toDateString() : undefined,
        count: exercise.length,
        log: exercise.map(e => {
          e = e.toObject();
          e.date = e.date.toDateString();
          return e;
        })
      };
      res.json(exercises);
    });
  });
});

app.listen(3000, () => console.log('Your app is listening on port 3000'));