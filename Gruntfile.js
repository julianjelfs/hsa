module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
      options : {
        mangle : true,
        report : 'min',
        beautify : false
      },
      my_target: {
        files: {
          'public/js/script.min.js': 
            ['public/js/components/jquery/jquery.js', 
             'public/js/components/angular/angular.js',
             'public/js/modules/http-auth-interceptor.js',
             'public/js/components/foundation/foundation.js',
             'public/js/components/foundation/foundation.topbar.js',
             'public/js/components/foundation/foundation.reveal.js',
             'public/js/components/foundation/foundation.dropdown.js',
             'public/js/components/moment/moment.js',
             'public/js/app.js',
             'public/js/controllers/*.js',
             'public/js/routing.js',
             'public/js/services.js',             
             'public/js/filters.js',
             'public/js/directives.js']
        }
      }
    },
    watch: {
      files: ['public/js/**/*.js'],
      tasks: 'uglify'
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['uglify']);
};
