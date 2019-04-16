var express = require('express');
var router = express.Router();
const Users = require('../models/users');

/* GET users listing. */
router.route('/')
.get((req, res, next)=> {
  Users.find({$or: [{first_name: req.query.name}, {last_name: req.query.name}]}).skip(+req.query.page).limit(req.query.limit ? +req.query.limit : 5).sort(req.query.sort)
  .then(users=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(users)
  }, err=> next(err))
  .catch(err=> next(err))
})
.post((req, res, next)=> {
  Users.create(req.body)
  .then(user=> {
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json')
    res.json(user)
  }, err=> next(err))
  .catch(err=> next(err))
});

router.route('/:id')
.get((req, res, next)=> {
  Users.findOne({id: req.params.id})
  .then(user=> {
    if(user) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(user)
    }
    else {
      let err = new Error('User not found!')
      err.status = 404;
      return next(err)
    }
  }, err=> next(err))
  .catch(err=> next(err))
})
.put((req, res, next)=> {
  Users.findOne({ id: req.params.id })
  .then(user=> {
    if(user) {
      if(req.body.first_name) user.first_name = req.body.first_name;
      if(req.body.last_name) user.last_name = req.body.last_name;
      if(req.body.age) user.age = req.body.age
      user.save()
      .then(user=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(user)
      })
    }
    else {
      let err = new Error('User not found!')
      err.status = 404;
      return next(err)
    }
  }, err=> next(err))
  .catch(err=> next(err))
})
.delete((req, res, next)=> {
  Users.deleteOne({id: req.params.id})
  .then(resp=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(resp)
  }, err=> next(err))
  .catch(err=> next(err))
})

module.exports = router;
