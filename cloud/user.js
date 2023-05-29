// End point for User Sign Up
Parse.Cloud.define("signUp" , async ( req )=>{
    try {
      const { username , password , email } = req.params ;
      const user = new Parse.User();
      if( !( username && password && email ) ){
        throw new Error("Missing Params");
      }
      const data = {
        username,
        password,
        email:email.toLowerCase()
      }
      // user.set("username",username);
      // user.set("password",password);
      // user.set("email",email.toLowerCase());
      // let result = await user.singUp(null,{useMasterKey:true}); in case already set the key value pair
      let result = await user.signUp(data,{useMasterKey:true});
      return result ;
    } catch (error) {
      console.error(error);
      throw error ; 
    }
  });
  
  
  // End point for user login
  Parse.Cloud.define("logIn", async ( req )=>{
    try {
      const { username, password } = req.params ;
      if( !( username && password ) ){
        throw new Error("Missing either password or username");
      }
      let user = await Parse.User.logIn(username,password);
      return user;
    } catch (error) {
      console.error(error);
      throw error ;
    }
  });
  
  // Logout endpoint
  Parse.Cloud.define("logOut", async ( req )=>{
    try {
      if( !req.user ){
        throw new Error("Unauthorized Access");
      }
  
      const userId = req.user.id ;
      const Session = Parse.Object.extend("_Session");
      const query = new Parse.Query(Session);
      query.equalTo("user",{
        __type:'Pointer',
        className:'_User',
        objectId:userId
      });
      const activeSessions = await query.find({useMasterKey:true});
      const result = await Parse.User.logOut();
      
      for( let i = 0 ;i < activeSessions.length ;i++){
        activeSessions[i].destroy();
      }
      // return {activeSessions, id : req.user.id} ;
      return "Logout done all sessions destroyed" ;
    } catch (error) {
      console.error(error);
      throw error ;
    }
  });