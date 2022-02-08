// Implement your posts router here
const { Router } = require('express');
const router = Router();

const Posts = require('./posts-model');

// Endpoints

// ✅ | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database                                                          |
router.get('/', (req, res) => {
	Posts.find()
		.then(posts => {
			res.json(posts);
		})
		.catch(err => {
			res.status(500).json({message: 'The posts information could not be retrieved'});
		});
});

// ✅ | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
router.get('/:id', async (req, res) => {
	try {
		const searchedPost = await Posts.findById(req.params.id);
		if (searchedPost == null) {
			res.status(404).json({message: 'The post with the specified ID does not exist'});
		} else {
			res.json(searchedPost);
		}
	} catch(err) {
		res.status(500).json({message: 'The post information could not be retrieved'});
	};
});

// ✅ | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
router.post('/', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({message: 'Please provide title and contents for the post'});
	} else {
		Posts.insert(req.body)
			.then(post => {
				res.status(201).json({
					id: post.id,
					...req.body,
				});
			})
			.catch(err => {
				res.status(500).json({message: 'There was an error while saving the post to the database'});
			});
	};
});

// ✅ | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
router.put('/:id', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({message: 'Please provide title and contents for the post'});
	} else {
		Posts.update(req.params.id, req.body)
			.then(updatedPost => {
				console.log(updatedPost);
				if (!updatedPost) {
					res.status(404).json({message: 'The post with the specified ID does not exist'});
				} else {
					res.json({
						...req.body,
						id: Number(req.params.id)
					});
				};
			})
			.catch(err => {
				res.status(500).json({message: 'The post information could not be modified'});
			});
	};
});

// ✅ | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |
router.delete('/:id', async (req, res) => {

	const deletedPost = await Posts.findById(req.params.id);
	console.log(deletedPost);

	Posts.remove(req.params.id)
		.then(removedPost => {
			if (removedPost != 1) {
				res.status(404).json({message: 'The post with the specified ID does not exist'});
			} else {
				res.json(deletedPost);
			};
		})
		.catch(err => {
			res.status(500).json({message: 'The post could not be removed'});
		});
});

// ✅ | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id                                  |
router.get('/:id/comments', async (req, res) => {
	const queriedPost = await Posts.findById(req.params.id);

	if (queriedPost == null) {
		res.status(404).json({message: 'The post with the specified ID does not exist'});
	} else {
		Posts.findPostComments(req.params.id)
			.then(comments => {
				res.json(comments);
			})
			.catch(err => {
				res.status(500).json({message: 'The comments information could not be retrieved'});
			});
	};
});

module.exports = router;