
Posts = new Mongo.Collection('posts');
Posts.allow({
	update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); },
});
Posts.deny({
	update: function(userId,post,fieldNames){
		return(_.without(fieldNames,'url','title').length>0);
	}
	
});
validatePost = function(post){
	var errors={};
	
	if(!post.title)
		errors.title = "Please fill in a headline";
	if(!post.url)
		errors.url= "Please fill in a URL";
	return errors;
}
Meteor.methods({
	postInsert: function(postAttributes){
		check(Meteor.userId(),String);
		check(postAttributes, {
			title: String,
			url: String
		});
		var errors=validatePost(postAttributes);
		if(errors.title||errors.url)
			throw new Meteor.Error('invalid-post',"You must set a title and URL for your post");
		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink){
			return{
				postExists: true,
				_id: postWithSameLink._id
			}
		}
		var user=Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			commentsCount:	0,
			upvoters: [],
			votes: 0
		});
		var postId = Posts.insert(post);
		return {
			_id: postId
		};
	},
	upvote: function(postId){
		var user = Meteor.user();
		if(!user)
			throw new Meteor.Error(401, "Надо залогиниться чтобы голосовать");	
		var post = Posts.findOne(postId);
		if(!post)
			throw new Meteor.Error(422,'Пост не найден');
		if(_.include(post.upvoters,user._id))
			throw new Meteor.Error(422,'Вы уже голосовали за этот пост');
		Posts.update(post._id,{
			$addToSet:{upvoters: user._id},
			$inc: {votes: 1}
		});
		
	}
});
