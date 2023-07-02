const express = require('express');

const router = express.Router();

const homeController = require('../controllers/index');

const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, homeController.getHome);
router.get('/problems',isAuth, homeController.getProblems);
router.get("/problemPost",isAuth,homeController.getNewProblem);
router.get("/blogCreate",isAuth,homeController.getNewBlog);

module.exports = router;