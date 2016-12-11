var blogPosts = {
  "my-first-webpage": { //key
    "title": "My first webpage", //value   
    "excerpt": "I've taken a course at Code at Uni and created my own personal website with HTML and CSS.",
    "content": "\
    <p>My first paragraph as well!</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
  "hello-world": { // key
    "title": "Hello World", //value
    "excerpt": "This is the start of my online journal. I will take about my journey in learning how to code!",
    "content": "\
    <p>Hello World this is a paragraph.</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
};
var express = require('express'); /* require is used to import from a library of predefined properties/classes etc */
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mailgun = require('mailgun-js')({
  apiKey: 'key-9863c11ea67cef7cde9688d53936054d',
  domain: 'sandboxcc9557f0fbca4a6da0d992ee9d6078ea.mailgun.org'
});
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.get('/', function(request, response){
 response.render('home.hbs');
});
app.get('/blog', function (request, response) {
  var listOfPosts = [];
var blogPostKeys = Object.keys(blogPosts);
blogPostKeys.forEach(function(blogId){
  var post = blogPosts[blogId];
  post.id = blogId;
  listOfPosts.push(post);
});
response.render('blog.hbs', {
  posts: listOfPosts
});
});
app.get('/contact', function(request, response){
 response.render('contact.hbs');
});
// Handle the contact form submission
app.post('/contact', function (request, response) {
 
 var formBody = {
   'name': request.body.name,
   'email': request.body.email,
   'subject': request.body.subject,
   'message': request.body.message
 }
 var missingName = (formBody.name === '');
 var missingEmail = (formBody.email === '');
 var missingMessage = (formBody.message === '');
 if(missingName || missingEmail || missingMessage) {
   response.render('contact',{
     error: true,
     message: 'Some fields are missing',
     formBody: formBody,
     missingName: missingName,
     missingEmail: missingEmail,
     missingMessage: missingMessage
   })
 } else {
   var emailOptions = {
     from: formBody.name + '<' + formBody.email + '>',
     to: 'adel.bhurtun.14@ucl.ac.uk',
     subject: 'Website contact form - ' + formBody.subject,
     text: formBody.message
   }
   mailgun.messages().send(emailOptions, function (error, res) {
     console.log(res);
     if(error) {
       response.render('contact', {
         error: true,
         message: 'There was an error sending the message',
         formBody: request.body
       })
     } else {
       response.render('contact', {
         success: true,
         message: 'Your message has been successfully sent!'
       })
     }
   })
 }
});
// A single blog post
app.get('/blog/:post_id', function(req, res) {
  // Extract the ID from the url entered
  var postId = req.params['post_id'];
  // Find the post
  var post = blogPosts[postId];
  // Show a 404 page if the post does not exist
  if (!post) {
    res.send('Not found');
  } else {
    // Render post.handlebars with the data it needs
    res.render('post', post);
  }
});
app.listen(5000, function(){
 console.log('Im listening on port 5000 man');
});