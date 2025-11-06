import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  const post = new Post({ ...req.body, authorId: req.user.id });
  await post.save();
  res.json(post);
};

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'Admin' && post.authorId.toString() !== req.user.id)
    return res.status(403).json({ error: 'Not your post' });

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });

  if (req.user.role !== 'Admin' && post.authorId.toString() !== req.user.id)
    return res.status(403).json({ error: 'Not your post' });

  await post.deleteOne();
  res.json({ message: 'Deleted successfully' });
};
