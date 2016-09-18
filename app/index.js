'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var htmlWiring = require('html-wiring');
var cgUtils = require('../utils.js');
var _s = require('underscore.string');

module.exports = yeoman.Base.extend({

    constructor: function() {
        yeoman.Base.apply(this, arguments);
        this.pkg = JSON.parse(htmlWiring.readFileAsString(path.join(__dirname, '../package.json')));
        this._s = _s;
    },

    prompting: function() {
        var cb = this.async();

        var prompts = [{
            name: 'appname',
            message: 'What would you like the angular app/module name to be?',
            default: path.basename(process.cwd())
        }, {
            name: 'router',
            type:'list',
            message: 'Which router would you like to use?',
            default: 0,
            choices: ['Standard Angular Router','Angular UI Router']
        }];

        this.prompt(prompts).then(function (props) {
            this.appname = props.appname;

            if (props.router === 'Angular UI Router') {
              this.uirouter = true;
              this.routerNPMName = "angular-ui-router";
              this.routerNPMVersion = "~0.3";
              this.routerModuleName = 'ui.router';
              this.routerViewDirective = 'ui-view';
            } else {
              this.uirouter = false;
              this.routerNPMName = "angular-route";
              this.routerNPMVersion = "^1.5.8";
              this.routerModuleName = 'ngRoute';
              this.routerViewDirective = 'ng-view';
            }
            this.config.set('uirouter',this.uirouter);

            cb();
        }.bind(this));
    },

    install: function() {

        this.directory('skeleton/','./');

        this.config.set('modalDirectory','modal/');
        this.config.set('directiveDirectory','directive/');
        this.config.set('filterDirectory','filter/');
        this.config.set('serviceDirectory','service/');
        this.config.set('componentDirectory','component/');
        var inject = {
            ts: {
                file: 'index.ts',
                template: 'import \'./<%= filename %>\';',
                relativeToModule: true
            },
            scss: {
                relativeToModule: true,
                file: 'index.scss',
                marker: cgUtils.SCSS_MARKER,
                template: '@import "<%= filename.substring(0,filename.lastIndexOf(\'.\')) %>";'
            }
        };
        this.config.set('inject',inject);
        this.config.save();
        this.installDependencies({ bower: false, callback: () => {
            this.spawnCommandSync('typings', ['install']);
        } });
    }

});

