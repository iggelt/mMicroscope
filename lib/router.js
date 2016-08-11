Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return  Meteor.subscribe('notifications'); 
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function(){
    return parseInt(this.params.postsLimit)||this.increment;
  },
  findOptions: function(){
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  subscriptions: function(){
    this.postsSub =  Meteor.subscribe('posts',this.findOptions());
  },
  posts: function(){
    return Posts.find({},this.findOptions());
  },
  data: function(){
    var hasMore = this.posts().fetch().length ===this.limit();
    var next Path = this.route.path({postsLimit: this.limit()+this.increment});
    return{
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore / nextPath : null
    };
  }
});
  
  Router.route('/posts/:_id',{
      name: 'postPage',
      waitOn: function(){
        return Meteor.subscribe('comments', this.params._id);
      },
      data: function() { return Posts.findOne(this.params._id)}
  });

 Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
 });

Router.route('/submit', {name: 'postSubmit'});

  Router.route('/:postsLimit?', {
      name: 'postsList',
      controller: PostsListController
  });

var requireLogin = function() {
  if (! Meteor.user()){
      if(Meteor.logginIn()){
          this.render(this.loadingTemplate); 
      }else{
          this.render('accessDenied');
      }
  } else {
      this.next();
  }
}
Router.onBeforeAction('dataNotFound',{only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
