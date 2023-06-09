/***** MODULES *****/



/* SET EXPRESS & OPTIONS */
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* SET RENDER ENGINE */
require("ejs");
app.set('view engine', 'ejs');

/* OTHER MODULES */
require("dotenv").config();
const _ = require("lodash");
const mongoose = require("mongoose");



/***** DATABASE *****/



/* CONNECT TO MONGO DATABASE */
const URI = `mongodb+srv://origin.howe4yr.mongodb.net/`;
const SERVER_USERID = process.env.ORIGIN_USERID;
const SERVER_KEY = process.env.ORIGIN_KEY;
const DATABASE = "blogEntries";

async function mongoConnect() {
  try {
    await mongoose.connect(URI, {
      user: SERVER_USERID,
      pass: SERVER_KEY,
      dbName: DATABASE
    })
  } catch (err) {
    console.log(err);
  } finally {
    console.log(`Connection to database ${_.capitalize(DATABASE)} successful.`)
  }
};

/* DEFINE ODM */
const PostsSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", PostsSchema);



/***** PAGES *****/



/* HOME */
app.get('/', async (req, res) => {

  const homeStartingContent = new Post({
    title: "Hello",
    content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
  });

  mongoConnect();

  const posts = await Post.find();

  if (posts.length === 0 || posts === null) {
    await Post.insertMany( homeStartingContent )
  }

  posts.forEach(post => {
    post["titleRequest"] = (_.kebabCase(post.title)); // title request key used to define url param for "/posts" get
  });

  res.render('home', {
    posts: posts // used to iterate through posts
  });
});


/* ABOUT */
app.get('/about', (req, res) => {

  const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

  res.render('about', {
    aboutContent: aboutContent
  });
});


/* CONTACT */
app.get('/contact', (req, res) => {

  const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

  res.render('contact', {
    contactContent: contactContent
  });
});


/* COMPOSE */
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {

  await mongoConnect();

  try {
    const post = new Post({
      title: _.startCase(_.camelCase(req.body.postTitle)),
      content: req.body.postContent });
    await post.save(); // insert one doesn't exist because of this method call
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect("/"); // always redirects to home page after post submission
  }

});

/* DYNAMIC POST URLS */
app.get('/posts/:postTitle', async (req, res) => {

  const post = await Post.findOne({
    title: _.startCase(_.camelCase(req.params.postTitle))
  });

  console.log(post);

  res.render('post', {
    postTitle: post.title,
    postContent: post.content
  });

});


/* DEPLOY APP on RAILWAY PORTS or USE 3000 if LOCAL */
let PORT = process.env.PORT;
if (PORT == null || PORT === "") {
  PORT = 3000;
}

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});