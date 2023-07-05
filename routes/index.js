const express = require('express');

const router = express.Router();

const homeController = require('../controllers/index');

const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, homeController.getHome);
<<<<<<< HEAD
router.get('/problems',isAuth, homeController.getProblems);
router.get("/problemPost",isAuth,homeController.getNewProblem);
router.get("/blogCreate",isAuth,homeController.getNewBlog);
router.get("/viewProblem",isAuth,homeController.getProblem);
router.get("/viewBlog",isAuth,homeController.getPost);
=======
router.get('/createBlog', isAuth, homeController.getCreateBlog);
router.post('/createBlog', isAuth, homeController.postCreateBlog);
router.get('/problems', isAuth, homeController.getProblems);
router.get('/createProblem', isAuth, homeController.getCreateProblem);
router.post('/createProblem', isAuth, homeController.postProblem);
router.get('/problem/:problemId', isAuth, homeController.getProblem)
>>>>>>> 305d73b1c04351a173d1712916651ce0bb94b6ad

module.exports = router;