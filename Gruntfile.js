module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'src/*/.js',
        dest: 'build/app.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/*/.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default tasks
  grunt.registerTask('default', ['uglify', 'watch']);
};