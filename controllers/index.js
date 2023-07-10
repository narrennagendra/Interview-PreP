const Blog = require('../models/blog');
const Problem = require('../models/problem');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

exports.getHome = async (req, res, next) => {
	try {
		const blogs = await Blog.find({}, 'title author date authorName _id');
		res.render('blog', {
			blogs: blogs
		});
	} catch (err) {
		console.log(err);
	}
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

exports.getProblems = async (req, res, next) => {
	try {
		const problems = await Problem.find({}, 'title _id');
		res.render('problems', {
			problems: problems
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCreateProblem = (req, res, next) => {
	res.render('problemPost');
};

exports.postProblem = async (req, res, next) => {
	try {
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

exports.getProblem = async (req, res, next) => {
	try {
		const problemId = req.params.problemId;
		const problem = await Problem.findById(problemId);
		const problemStatement = new QuillDeltaToHtmlConverter(problem.problemStatement);
		const editorial = new QuillDeltaToHtmlConverter(problem.editorial);
		res.render('viewProblem', {
			problemStatement: problemStatement.convert(),
			editorial: editorial.convert(),
			title: problem.title
		})
	} catch (err) {
		console.log(err);
	}
};

exports.getBlog = async (req, res, next) => {
	try{
		const blogId = req.params.blogId;
		const blog = await Blog.findById(blogId);
		const content = new QuillDeltaToHtmlConverter(blog.content);
		res.render('viewBlog', {
			title: blog.title,
			content: content.convert()
		})
	} catch (err) {
		console.log(err);
	}
};