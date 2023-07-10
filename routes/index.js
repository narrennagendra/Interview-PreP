const express = require('express');

const router = express.Router();

const homeController = require('../controllers/index');

const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, homeController.getHome);
router.get('/blog/:blogId', homeController.getBlog);
router.get('/createBlog', isAuth, homeController.getCreateBlog);
router.post('/createBlog', isAuth, homeController.postCreateBlog);
router.get('/problems', isAuth, homeController.getProblems);
router.get('/createProblem', isAuth, homeController.getCreateProblem);
router.post('/createProblem', isAuth, homeController.postProblem);
router.get('/problem/:problemId', isAuth, homeController.getProblem);

module.exports = router;