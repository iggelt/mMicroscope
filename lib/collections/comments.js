Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes){
		console.log('zzzzz');
		check(this.userId,String);
		check(commentAttributes,{
			postId: String,
			body: String
		});
		
		
		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);
		
		if(!post)
			throw new Meteor.Error('invalid-comment','You must comment on a post');
		comment = _.extend(commentAttributes,{
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});
		Posts.update(comment.postId,{$inc:{commentsCount: 1}});
		return Comments.insert(comment);
	}
});
