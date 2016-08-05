Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes){
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
		return Comments.insert(comment);
	}
});
