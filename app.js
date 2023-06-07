const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

require('dotenv').config();
const SERVER_USERID = process.env.ORIGIN_USERID;
const SERVER_KEY = process.env.ORIGIN_KEY;
const DATABASE_NAME = "blogEntries";

let posts = [];

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${SERVER_USERID}:${SERVER_KEY}@origin.howe4yr.mongodb.net/${DATABASE_NAME}`;
const client = new MongoClient(
  uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
);

async function mongoConnect() {
  try {
    await client.connect();
    console.log("Connected to mongo client.");
  } catch (err) {
    console.log(err);
  }
};

const homePost = new Post({
  title: "Hello",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

console.log(homePost.title);
console.log(homePost.content);

// set static folder to public, defines access path to styling elements
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// set render engine as ejs, recognize path to views folder
app.set('view engine', 'ejs');

// ROOT
app.get('/', (req, res) => {
  res.render('home', {
    homeStartingContent: homeStartingContent,
    posts: posts
  });
});

// ABOUT
app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent
  });
});

// CONTACT
app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent
  });
});

// COMPOSE
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {

  const composeTitle = req.body.postTitle;
  const composeBody = req.body.postBody;

  const PostsSchema = {
    title: String,
    content: String
  };
  
  const Post = mongoose.model("Post", PostsSchema);

  const post = {
    title: req.body.postTitle,
    titleRequest: _.kebabCase(req.body.postTitle),
    body: req.body.postBody
  };

  posts.push(post);
  res.redirect('/');

});

// POSTS
app.get('/posts/:postTitle', (req, res) => {
  posts.forEach( (post) => {
    if (_.lowerCase(req.params.postTitle) === _.lowerCase(post.title)) {
      res.render('post', {
        postTitle: post.title,
        postBody: post.body
      });
    }
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