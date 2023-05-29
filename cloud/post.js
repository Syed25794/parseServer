const Posts = Parse.Object.extend("Posts");
const Comments = Parse.Object.extend("Comments");


// Creating Post 
Parse.Cloud.define("createPost", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const { title, description, comments }= req.params;
    const post = new Posts();
    const data = {
      title,
      description,
      comments:comments || []
    };
    let result = await post.save(data);
    return result ;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});

//Get post 
Parse.Cloud.define("post", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const { postId } = req.params ;
    const query = new Parse.Query(Posts);
    const result = await query.get(postId);
    return result;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});

//Get all posts
Parse.Cloud.define("posts", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const query = new Parse.Query(Posts);
    const posts = await query.find();
    return posts ;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});

//Update post 
Parse.Cloud.define("updatePost", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const { postId ,title1, description1 , comments1  } = req.params ;
    const query = new Parse.Query(Posts);
    query.equalTo("objectId",postId);;
    const result = await query.first();
    if( result ){
      const { title, description } = result.attributes;
      result.set("title", title1 === undefined ? title : title1);
      result.set("description" , description1 === undefined ? description : description1 );
      if( comments1 !== undefined ){
        result.add("comments" ,comments1 );
      }
      const result1 = await result.save();
      return result1 ;
      }else{
        throw new Error("Something Went Wrong in Updating the Object!");
      }
    } catch (error) {
      console.error(error);
      throw error ;
      }
    });
      
//deleting Post with its all comments 
Parse.Cloud.define("deletePost", async ( req )=>{
  try {
    const { postId } = req.params ;
    const postQuery = new Parse.Query(Posts);
    const commentQuery = new Parse.Query(Comments);
    commentQuery.equalTo("postId",postId);
    const comments = await commentQuery.find();
    console.log(comments);
    for(let i=0;i<comments.length;i++){
    const deleteComment = await comments[i].destroy();
      console.log(deleteComment,"deleted Comment");
    }
    const post = await postQuery.get(postId);
    const result = await post.destroy();
    return result ;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});
