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
const SERVER_USERID = process.env.ORIGIN_USERID;
const SERVER_KEY = process.env.ORIGIN_KEY;
const URI = `mongodb+srv://origin.howe4yr.mongodb.net/`;
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
    console.log(`Connection to database ${DATABASE} successful.`)
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

  if (posts.length === 0) {
    await Post.insertMany( homeStartingContent )
  }

  posts.forEach(post => {
    console.log(`TITLE: ${post.title}`);
    console.log(`CONTENT: ${post.content}`);
  })

  res.render('home', {
    posts: posts
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

  const composeTitle = req.body.postTitle;
  const composeBody = req.body.postBody;

  try {
    await mongoConnect();
    
    const posts = await Post.find();

    posts.forEach(post => {
      
    });

  } catch (err) {
    console.log(err);
  }

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