const Blog = require('../models/blog');

exports.getHome = (req, res, next) => {
	res.render('blog');
};

exports.getCreateBlog = (req, res, next) => {
	res.render('blogCreate');
}

exports.postCreateBlog = async (req, res, next) => {
	try {
		const title = req.body.title;
		const content = req.body.content;
		const blog = new Blog({
			title: title,
			content: content,
			author: req.user._id
		});
		await blog.save();
		res.status(200).json({
			message: 'blog created'
		});
	} catch (err) {
		console.log(err);
	}
}