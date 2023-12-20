const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const helper = require("./testHelper.test");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.blogs.map(
    (blog) =>
      new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes ? blog.likes : 0,
      })
  );

  const promiseArray = blogObjects.map((blog) => {
    blog.save();
  });
  await Promise.all(promiseArray);
}, 100000);

test("blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.blogs.length);
}, 15000);

test("id", async () => {
  const blogs = await Blog.find({});

  const blogExample = blogs[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogExample.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultBlog).toBeDefined();
});

test("post", async () => {
  const newBlog = {
    title: "aaa",
    author: "bbb",
    url: "ccc",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await Blog.find({});

  expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);
}, 100000);

test("deleted", async () => {
  const blogsfirst = await Blog.find({});
  const blogToDelete = blogsfirst[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsthen = await Blog.find({});

  expect(blogsthen).toHaveLength(helper.blogs.length - 1);

  const titles = blogsthen.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("update", async () => {
  const blogsfirst = await Blog.find({});

  const blogToView = blogsfirst[0];

  const newBlog = {
    title: blogToView.title,
    author: blogToView.author,
    url: blogToView.url,
    likes: 0,
  };

  await api
    .put(`/api/blogs/${blogToView.id}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsthen = await helper.blogsInDb();

  expect(blogsthen).toHaveLength(helper.blogs.length);

  const beforeLikes = blogsfirst.map((n) => n.likes);

  const afterLikes = blogsthen.map((n) => n.likes);

  expect(afterLikes).not.toContain(beforeLikes);
});

afterAll(async () => {
  await mongoose.connection.close();
});
