Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {return Meteor.subscribe('posts'); }
});

Router.map(function() {
  this.route('postsList', {path: '/'});
  
  this.route('postPage',{
      path: '/posts/:_id' 
  });
});

Router.onBeforeAction('loading');
