const express = require('express');

const router = express.Router();

const homeController = require('../controllers/index');

const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, homeController.getHome);
router.get("/createBlog", isAuth, homeController.getCreateBlog);
router.post('/createBlog', isAuth, homeController.postCreateBlog);


module.exports = router;