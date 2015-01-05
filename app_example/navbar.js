var app = angular.module('exampleApp')
.config(function (ConfigurationProvider) {

  ConfigurationProvider.addNavbarItem({
    label: 'Posts',
    link: {
      type: 'entity',
      url: 'posts'
    }
  });

  ConfigurationProvider.addNavbarItem({
    label: 'Categories',
    link: {
      type: 'entity',
      url: 'categories'
    }
  });

  ConfigurationProvider.addNavbarItem({
    label: 'Comments',
    link: {
      type: 'entity',
      url: 'comments'
    }
  });

  ConfigurationProvider.addNavbarItem({
    label: 'Tags',
    link: {
      type: 'entity',
      url: 'tags'
    }
  });

  ConfigurationProvider.addNavbarItem({
    label: 'Blog',
    link: {
      type: 'url',
      url: 'http://myblog.com'
    }
  });

});
