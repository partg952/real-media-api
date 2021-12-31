import express from "express";
import mysql from "mysql2";
import { v4 as uuidv4 } from "uuid";
const app = express();


app.use(express.json())



function makeConnection ( database_name )
{
  return mysql.createConnection({
    host: "localhost",
    user: "god",
    password: "root",
    database: database_name,
  });
}

app.get("/sign-up", (req, res) => {
  const username = req.query["username"];
  const password = req.query["password"];
  const email = req.query[ "email" ];
  var con = makeConnection( "real_media_users" );
  con.connect( ( err ) =>
  {
    if ( err ) { console.log( err ) }
    else { console.log( "users database connected!!" ) };
  })
  const sqlquery = `INSERT INTO users (username,email,password,user_pic) VALUES ("${username}","${email}","${password}","https://user-pic.png"); `;
    con.query( sqlquery, ( err, data ) =>
    {
        if ( err )
        {
          res.send(err)
        }
        else
        {
            res.send("data saved!!")
        }
  });
} );

app.get( "/all-users", ( req, res ) =>
{
    var con = makeConnection("real_media_users");
    con.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("users database connected!!");
      }
    } );
  
  con.query( "select * from users;", ( err, data ) =>
  {
    if ( err ) { console.log( err ) }
    else{res.send(data)}
  })
})

app.get( "/make-post", ( req, res ) =>
{
  const uuid = uuidv4();
  const posted_by = req.query.posted_by;
  const content_type = req.query.content_type;
  const content = req.query.content;
  const time = req.query.time;
  const message = req.query.message;
  const userPic = req.query.user_pic

  var con = makeConnection( "real_media_posts" );
  const con2 = makeConnection( "real_media_comments" );
con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("posts database connected!!");
  }
} );
  con2.connect( ( err ) =>
  {
    if ( err ) { console.log( err ) }
    else{console.log("comments database connected!!")}
  })
  
  con.query( `insert into posts (posted_by,content_type,content,message,post_name,user_pic) values ("${posted_by}","${content_type}","${content}","${message}","${uuid}","${userPic}")`, ( err, data ) =>
  {
    if ( err ) { res.send( err ) }
    else { res.send( res.send(uuid) ) }
    con2.query( `create table ${ uuid.replaceAll("-","_") } (comment_id int not null auto_increment,commented_by text,comment text,primary key(comment_id));`, ( err2, data2 ) =>
    {
      if ( err2 ) { console.log( err2 ) }
      else{console.log("comment table for the post made!!")}
    })
    
  })
})

app.get( "/all-posts", ( req, res ) =>
{
  const con = makeConnection( "real_media_posts" );
  con.connect( ( err ) =>
  {
    if ( err ) { console.log( err ) }
    else { console.log( "post database connected!!" ) }
    
  } )
  con.query( "select * from posts", ( err, data ) =>
  {
    if ( err ) { console.log( err ) }
    else{res.send(data) }
  })
} )

app.get( "/add-comment", ( req, res ) =>
{
  const postId = req.query[ 'id' ];
  const postedBy = req.query[ 'sender' ];
  const commentMessage = req.query[ 'message' ];
  const con = makeConnection( "real_media_comments" );
  con.connect( ( err ) =>
  {
    err ? console.log( err ) : console.log( "comments database connected!!" );

  } )
  con.query( `insert into ${ postId } (commented_by,comment) values ("${postedBy}","${commentMessage}")`, ( err, data ) =>
  {
    err ? console.log( err ) : res.send( "comment added succesfully!" );
  })
})

app.get( "/show-comments", ( req, res ) =>
{
  const postId = req.query[ 'id' ];
  const con = makeConnection( "real_media_comments" );
  con.connect( err =>
  {
    err ? console.log( err ) : console.log( "comments datbase connected !!" );
  } )
  con.query( `select * from ${ postId }`, ( err, data ) =>
  {
    err ? console.log( err ) : res.send( data );
  })
} )

app.get( "/user-info", ( req, res ) =>
{
  const username = req.query[ 'username' ];
  const con = makeConnection( "real_media_users" );
  
  con.query( `select * from users where username like "${ username
    }" `, ( err, data ) =>
  {
    err ? console.log( err ) : res.send( data );
  })
} )

app.get( "/user-posts", ( req, res ) =>
{
  const username = req.query[ 'username' ];
  const con = makeConnection( "real_media_posts" );
  con.connect( err =>
  {
    err ? console.log( err ) : console.log( "posts database connected successfully!!" );

  } )
  
  con.query( `select * from posts where posted_by like "${ username }"`, ( err, data ) =>
  {
    err ? console.log( err ) : res.send( data );
  })

})


app.listen(8080, () => {
  console.log("listening at 8080");
  
});
