const Blog = require('../models/blog');
const Problem = require('../models/problem');
const Comment = require('../models/comment');

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
		const savedBlog = await blog.save();
		res.status(200).json({
			message: 'blog created',
			path: '/blog/' + savedBlog._id,
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
		const savedProblem = await problem.save();
		res.status(200).json({
			message: 'Problem created',
			path: '/problem/' + savedProblem._id,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getProblem = async (req, res, next) => {
	try {
		const problemId = req.params.problemId;
		const problem = await Problem.findById(problemId);
		if (!problem) {
			res.redirect('/problems');
		}
		const problemStatement = new QuillDeltaToHtmlConverter(problem.problemStatement);
		const editorial = new QuillDeltaToHtmlConverter(problem.editorial);
		res.render('viewProblem', {
			P_id: problem._id,
			problemStatement: problemStatement.convert(),
			editorial: editorial.convert(),
			title: problem.title
		})
	} catch (err) {
		console.log(err);
	}
};

exports.getBlog = async (req, res, next) => {
	try {
		const blogId = req.params.blogId;
		const blog = await Blog.findById(blogId)
			.populate('comments');
		if (!blog) {
			res.redirect('/blogs');
		}
		const content = new QuillDeltaToHtmlConverter(blog.content);
		const comments = blog.comments.map(comment => populateNestedComments(comment));
		res.render('viewBlog', {
			B_id: blog._id,
			title: blog.title,
			content: content.convert(),
			comments: comments
		})
	} catch (err) {
		console.log(err);
	}
};

exports.postComment = async (req, res, next) => {
	try{
		const blogId = req.params.blogId;
		const parentId = req.body.commentParentId;
		const content = req.body.content;
		const comment = new Comment({
			author: req.user._id,
			authorName: req.user.name,
			content: content
		});
		if(parentId === "null") {
			const blog = await Blog.findById(blogId);
			if(!blog) {
				return res.redirect('/');
			}
			blog.comments.push(comment);
			await blog.save();
		} else {
			const parentComment = await Comment.findById(parentId);
			if(!parentComment) {
				return res.redirect('/blog/' + blogId);
			}
			parentComment.children.push(comment);
			await parentComment.save();
		}
		res.redirect('/blog/' + blogId);

	} catch (err) {
		console.log(err);
	}
};

function populateNestedComments(comment) {
	return Comment.populate(comment, { path: 'children' })
		.then(comment => {
			if (comment.children.length > 0) {
				const childPromises = comment.children.map(childComment => populateNestedComments(childComment));
				return Promise.all(childPromises)
					.then(populatedChildren => {
						comment.children = populatedChildren;
						return comment;
					});
			}
			return comment;
		});
}