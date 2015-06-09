'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-maven-tasks");

  // Project configuration.
  grunt.initConfig({
    clean: [ '*.jar' ],
    maven: {
      install: {
        options: {
          goal: 'install',
          groupId: 'fr.gouv.agriculture.poc.apiruchers',
          type: 'jar',
          destFolder: 'META-INF/resources/apiruchers',
          // url: '<repository-url>',
        },
        src: [ '**', '!node_modules/**' ]
      }
    }
  });

  grunt.registerTask('install', [ 'clean', 'maven:install' ]);

}
