Template.postPage.helpers({
	comments: function(){
		return Comments.find({postsId: this._id});
	}
})