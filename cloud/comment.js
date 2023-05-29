const Posts = Parse.Object.extend("Posts");
const Comments = Parse.Object.extend("Comments");

// Create Comments for post
Parse.Cloud.define("createComment", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const { postId, commentDescription } = req.params ;
    let query = new Parse.Query(Posts);
    const post = await query.get(postId);
    const Comment = Parse.Object.extend(Comments);
    const comment = new Comment();
    const result = await comment.save({commentDescription,postId},{useMasterKey:true});
    post.add("comments",result.id);
    await post.save();
    return result; 
  } catch (error) {
    console.error(error);
    throw error ;
  }
});

//Get comment
Parse.Cloud.define("comment", async ( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const { commentId } = req.params;
    const query = new Parse.Query(Comments);
    const comment = await query.get(commentId);
    return comment;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});

//Get All Comments
Parse.Cloud.define("comments", async( req )=>{
  try {
    if( !req.user ){
      throw new Error("Unauthorized Access!");
    }
    const query = new Parse.Query(Comments);
    const comments = await query.find();
    return comments ;
  } catch (error) {
    console.error(error);
    throw error ;
  }
});


// Subscribing to specific classObject
Parse.Cloud.define("subscribe" , async ( req )=>{
  if( !req.user ){
    throw new Error("Unauthorized Access!");
  }

  try {
    const className = req.params ;
    const query = new Parse.Query(className);
    let subscription = await query.subscribe();
    subscription.on('open',()=>{
      return 'Subscription Subscribed.';
    });
    subscription.on('create',(object)=>{
      return `Object created : ${object.id}`;
    });
    subscription.on('update',(object)=>{
      return `Object updated : ${object.id}`;
    });
    subscription.on('delete',(object)=>{
      return `Object deleted : ${object.id}`;
    });
  } catch (error) {
    
  }
});


Parse.Cloud.define("unsubscribe", async ( req )=>{
  if( !req.user ){
    throw new Error("Unauthorized Access!");
  }
  try {
    const { className } = req.params ;
    const query = new Parse.Query(className);
    const subscription = await query.subscribe();
    subscription.on('close');
    subscription.unsubscribe();
    return 'Subscription Unsubscribed!';
  } catch (error) {
    console.error(error);
    throw error ;
  }
});



