const Blog = require('../models/blog');
const Problem = require('../models/problem');

exports.getHome = async (req, res, next) => {
	const blogs = await Blog.find({}, 'title author date authorName');
	res.render('blog', {
		blogs: blogs
	});
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
			author: req.user._id,
			authorName: req.user.name
		});
		await blog.save();
		res.status(200).json({
			message: 'blog created'
		});
	} catch (err) {
		console.log(err);
	}
}

exports.getProblems = (req, res, next) => {
	res.render('problems');
};

exports.getCreateProblem = (req, res, next) => {
	res.render('problemPost');
};

exports.postProblem = async (req, res, next) => {
	try{
		const title = req.body.title;
		const problemStatement = req.body.problemStatement;
		const editorial = req.body.editorial;
		const problem = new Problem({
			title: title,
			problemStatement: problemStatement,
			editorial: editorial,
			author: req.user._id,
			authorName: req.user.name
		});
		await problem.save();
		res.status(200).json({
			message: 'Problem created'
		});
	} catch (err) {
		console.log(err);
	}
};