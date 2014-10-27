'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n\n\n\n\n\n\n'
            },
            scripts: {
                src: 'src/js/**.js',
                dest: 'build/build.js'
            },
            styles: {
                src: 'src/css/**.css',
                dest: 'build/build.css'
            }
        },
        uglify: {
            dev: {
                files: {
                    'build/build.min.js': 'build/build.js'
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: '0'
            },
            dev: {
                files: {
                    'build/build.min.css': 'build/build.css'
                }
            }
        },
        ngtemplates: {
            cachedTemplates: {
                src: 'views/**.html',
                dest: 'js/templates.js'
            }
        },
        htmlbuild: {
            dev: {
                src: 'src/index.html',
                dest: 'build/index.html',
                options: {
                    scripts: {
                        build: 'build/build.min.js',
                        angular: [
                            'bower_components/angular/angular.min.js',
                            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                            'bower_components/angular-mocks/angular-route.min.js'
                        ],
                        bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        jquery: 'bower_components/jquery/dist/jquery.min.js',
                        sbadmin: [
                            'bower_components/metisMenu/dist/jquery.metisMenu.min.js',
                            'bower_components/sb-admin-v2/js/sb-admin.js'
                        ]
                    },
                    styles: {
                        build: 'build/build.min.css',
                        bootstrap: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        sbadmin: [
                            'bower_components/metisMenu/dist/metisMenu.min.css',
                            'bower_components/sb-admin-v2/css/sb-admin.css'
                        ]
                    }
                }
            }
        },
        copy: {
            main: {
                file: [
                    { expand: true, src: ['bower_components/'], dest: '' }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('default', ['ngtemplates', 'concat', 'cssmin', 'uglify', 'htmlbuild']);
    grunt.registerTask('lets-build', ['concat', 'cssmin', 'uglify', 'htmlbuild']);
    grunt.registerTask('no-templates', ['concat', 'cssmin', 'uglify', 'htmlbuild']);

};