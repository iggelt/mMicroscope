Posts = new Mongo.Collection('posts');
Meteor.methods({
	postInsert: function(postAttributes){
		check(meteor.userId(),String);	
	}	
});
