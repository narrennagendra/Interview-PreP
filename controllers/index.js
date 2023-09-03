const Blog = require('../models/blog');
const Problem = require('../models/problem');
const Comment = require('../models/comment');

const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

exports.getHome = async (req, res, next) => {
	try {
		const blogs = await Blog.find({}, 'title author date authorName _id tags');
		res.render('blog', {
			blogs: blogs,
			navPath: 'home'
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCreateBlog = (req, res, next) => {
	res.render('blogCreate', {
		navPath: 'create blog',
		title: '',
		content: '',
		tags: '',
		button_action: '/createBlog'
	});
}

exports.getEditBlog = async (req, res, next) => {
	try {
		const blogId = req.params.blogId;
		const blog = await Blog.findById(blogId);
		if ((!blog) || (blog.author.toString() !== req.user._id.toString())) {
			return res.redirect('/');
		}
		const content = new QuillDeltaToHtmlConverter(blog.content);
		res.render('blogCreate', {
			navPath: 'edit blog',
			content: content.convert(),
			title: blog.title,
			tags: blog.tags.join(','),
			button_action: '/editBlog/' + blogId
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postEditBlog = async (req, res, next) => {
	try {
		const blogId = req.params.blogId;
		const blog = await Blog.findById(blogId);
		if (!blog || req.user._id.toString() !== blog.author.toString()) {
			return res.status(403).json({
				message: 'Forbidden',
				path: '/blog/' + blog._id,
			});
		}
		const updatedTitle = req.body.title;
		const updatedT4ags = req.body.tags.split(',');
		const updatedContent = req.body.content;
		blog.title = updatedTitle;
		blog.tags = updatedT4ags;
		blog.content = updatedContent;
		await blog.save();
		res.status(200).json({
			message: 'blog sucessfully edited',
			path: '/blog/' + blog._id,
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postCreateBlog = async (req, res, next) => {
	try {
		const title = req.body.title;
		const content = req.body.content;
		const tags = req.body.tags.split(',');
		const blog = new Blog({
			title: title,
			content: content,
			author: req.user._id,
			authorName: req.user.name,
			tags: tags
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
		const problems = await Problem.find({}, 'title _id tags');
		res.render('problems', {
			problems: problems,
			navPath: 'problems'
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getCreateProblem = (req, res, next) => {
	res.render('problemPost', {
		navPath: 'problems',
		title: '',
		tags: '',
		problemStatement: '',
		editorial: '',
		button_action: '/createProblem',
	});
};

exports.postProblem = async (req, res, next) => {
	try {
		const title = req.body.title;
		const problemStatement = req.body.problemStatement;
		const editorial = req.body.editorial;
		const tags = req.body.tags.split(',');
		const problem = new Problem({
			title: title,
			problemStatement: problemStatement,
			editorial: editorial,
			author: req.user._id,
			authorName: req.user.name,
			tags: tags
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

exports.getEditProblem = async (req, res, next) => {
	try {
		const problemId = req.params.problemId;
		const problem = await Problem.findById(problemId);
		if (!problem || req.user._id.toString() !== problem.author.toString()) {
			 return res.redirect('/problems');
		}
		const problemStatement = new QuillDeltaToHtmlConverter(problem.problemStatement);
		const editorial = new QuillDeltaToHtmlConverter(problem.editorial);
		res.render('problemPost', {
			navPath: 'problems',
			title: problem.title,
			tags: problem.tags.join(','),
			problemStatement: problemStatement.convert(),
			editorial: editorial.convert(),
			button_action: '/editProblem/' + problemId
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postEditProblem = async (req, res, next) => {
	try {
		const problemId = req.params.problemId;
		const problem = await Problem.findById(problemId);
		if (!problem || req.user._id.toString() !== problem.author.toString()) {
			console.log('error ocuured')
			return res.status(403).json({
				message: 'Forbidden',
				path: '/problem/' + problemId._id,
			});
		}
		const updatedTitle = req.body.title;
		const updatedProblemStatement = req.body.problemStatement;
		const updatedEditorial = req.body.editorial;
		const updatedTags = req.body.tags.split(',');
		problem.title = updatedTitle;
		problem.tags = updatedTags;
		problem.problemStatement = updatedProblemStatement;
		problem.editorial = updatedEditorial;
		await problem.save();
		res.status(200).json({
			message: 'problem sucessfully updated',
			path: '/problem/' + problemId,
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
			return res.redirect('/problems');
		}
		const problemStatement = new QuillDeltaToHtmlConverter(problem.problemStatement);
		const editorial = new QuillDeltaToHtmlConverter(problem.editorial);
		res.render('viewProblem', {
			P_id: problem._id,
			problemStatement: problemStatement.convert(),
			editorial: editorial.convert(),
			title: problem.title,
			navPath: 'problems',
			edit: problem.author.toString() === req.user._id.toString()
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
		const populatedComments = blog.comments.map(comment => populateNestedComments(comment));
		const comments = await Promise.all(populatedComments);
		res.render('viewBlog', {
			_id: blog._id,
			title: blog.title,
			content: content.convert(),
			comments: comments,
			navPath: 'home',
			edit: blog.author.toString() === req.user._id.toString()
		});
	} catch (err) {
		console.log(err);
	}
};

exports.postComment = async (req, res, next) => {
	try {
		const blogId = req.params.blogId;
		const parentId = req.body.commentParentId;
		const content = req.body.comment;
		const comment = new Comment({
			author: req.user._id,
			authorName: req.user.name,
			content: content
		});
		if (parentId === "null") {
			const blog = await Blog.findById(blogId);
			if (!blog) {
				return res.redirect('/');
			}
			await comment.save();
			blog.comments.push(comment);
			await blog.save();
		} else {
			const parentComment = await Comment.findById(parentId);
			if (!parentComment) {
				return res.redirect('/blog/' + blogId);
			}
			await comment.save();
			parentComment.children.push(comment);
			await parentComment.save();
		}
		res.redirect('/blog/' + blogId);

	} catch (err) {
		console.log(err);
	}
};

const populateNestedComments = (comment) => {
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