module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            folder: "dist"
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './node_modules/wmsicon/dist/wmsicon',
                        dest: './dist/wm-remark-themes',
                        src: [
                            './**/*',
                            '!./**/*.html'
                        ]
                    },
                    {
                        expand: true,
                        cwd: './src',
                        dest: './dist/wm-remark-themes',
                        src: [
                            './**/*'
                        ]
                    }
                ]
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', [
        'clean',
        'copy'
    ]);

    grunt.registerTask('default', ['build']);
};
