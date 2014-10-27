'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n\n\n\n\n\n\n'
            },
            scripts: {
                src: [
                    'js/app.js',

                    'js/modules/modals/*.js',
                    'js/modules/group/*.js',
                    'js/modules/lesson/*.js',
                    'js/modules/feed.js'//,

                    //'js/templates.js'
                ],
                dest: 'libs/built.js'
            },
            bower: {
                src: [
                    'js/bower/jquery-1.11.0.js',
                    'js/bower/bootstrap.min.js',
                    'js/bower/angular.min.js',
                    'js/bower/angular-route.min.js',
                    'js/bower/ng-tags-input.min.js',
                    'js/bower/ui-bootstrap-tpls-0.11.2.js',
                    'js/bower/plugins/metisMenu/metisMenu.min.js',
                    'js/bower/sb-admin-2.js'
                ],
                dest: 'libs/bower.json'
            },
            styles: {
                src: [
                    'css/bootstrap.min.css',
                    "css/sb-admin-2.css",

                    "css/ng-tags-input.min.css",
                    "css/ng-tags-input.bootstrap.min.css",

                    'css/my.css',
                    'css/modules/feed.css',
                    'css/modules/lesson/lesson-info.css',
                    'css/modules/lesson/lesson-edit.css',
                    'css/modules/lesson/lesson-new.css',
                    'css/modules/lesson/lessons-list.css',

                    'css/modules/group-info/group-info.css',
                    'css/modules/group-info/group-info-edit.css'
                ],
                dest: 'libs/built.css'
            }
        },
        uglify: {
            stable: {
                files: {
                    'libs/built.min.js': 'libs/built.js'
                }
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: '0'
            },
            stable: {
                files: {
                    'libs/built.min.css': 'libs/built.css'
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
                        built: 'libs/built.js',
                        angular: [
                            'bower_components/angular/angular.min.js',
                            'bower_components/angular/angular.min.js.map',
                            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                            'bower_components/angular-mocks/angular-route.min.js',
                            'bower_components/angular-mocks/angular-route.min.js.map'
                        ],
                        bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        jquery: [
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/jquery/dist/jquery/jquery.min.map'
                        ]
                    },
                    styles: {
                        built: 'libs/built.min.css',
                        bootstrap: [
                            'bower_components/bootstrap/dist/css/bootstrap.min.css',
                            'bower_components/bootstrap/dist/css/bootstrap.css.map'
                        ]
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-auto-install');


    grunt.registerTask('default', ['ngtemplates', 'concat', 'cssmin', 'uglify', 'htmlbuild']);
    grunt.registerTask('no-templates', ['concat', 'cssmin', 'uglify', 'htmlbuild']);

};