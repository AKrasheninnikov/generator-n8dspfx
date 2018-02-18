'use strict';
// base generator scaffolding
const Generator = require('yeoman-generator');
// import SPFx generator - optional and not needed
const spfxYeoman = require('@microsoft/generator-sharepoint/lib/generators/app');
// import command-exists to check if yarn is installed
const commandExists = require('command-exists').sync;
// Add Color Support to Higlight steps in this generator
const chalk = require('chalk');

// Avoid conflict message
const fs = require('fs');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    // Initialisation Generator + SPFx generator
    initializing() {

        // Fetch current package.json
        this.pkg = require('../package.json');
        this.nested = false;

        this.composeWith(
            require.resolve(`@microsoft/generator-sharepoint/lib/generators/app`), {
                'skip-install': true,
                'framework': 'none',
                'nested': true
            }
        );
    }

    // Prompt for user input for Custom Generator
    prompting() {}

    // adds additonal editor support in this case CSS Comb
    configuring() {

        // Add .csscomb.json
        this._addEditorSupport();
    }

    // not used because of the dependencies of the SPFx file
    // Code was moved to Install
    writing() {

    }

    install() {
        this._custLog('Change configuration before actuall installation can happen');
        // Apply Custom configuration
        this._applyCustomConfig();
        // Adding externals      
        this._addExternals();

        // add additional typings
        this._addTypings();
        // write Sample Code
        this._writingSampleCode();

        this._custLog('Install required npm dependencies to exisitin package.json');
        // Install additional NPM Packages
        this._installNPMPackages();

        // process installations
        this._processInstall();
        
    }

    // Run installer normally time to say goodbye
    // If yarn is installed yarn will be used
    end() {

        // const hasYarn = commandExists('yarn');
        // this.installDependencies({
        //     npm: !hasYarn,
        //     bower: false,
        //     yarn: hasYarn,
        //     skipMessage: this.options['skip-install-message'],
        //     skipInstall: this.options['skip-install']
        // });

    }

    // Backup the default gulp file in case something was changed
    _backupSPFXConfig() {

        // backup default gulp file;
        // Fallback to NodeJS FS Object because otherwise in Yeoman context not possible
        fs.rename(
            this.destinationPath('gulpfile.js'),
            this.destinationPath('gulpfile.spfx.js')
        );

    }

    // Applies gulp and additonal config to project
    _applyCustomConfig() {

        this._backupSPFXConfig();

        // Copy custom gulp file to
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );

        // Add configuration for static assets.
        this.fs.copy(
            this.templatePath('config/copy-static-assets.json'),
            this.destinationPath('config/copy-static-assets.json')
        );

    }

    // reference external in config.json automatically
    _addExternals() {

        // "handlebars": "./node_modules/handlebars/dist/handlebars.amd.min.js"
        // reading JSON
        let config = this.fs.readJSON(this.destinationPath('config/config.json'));

        // Add Handlebars entry
        config.externals.handlebars = "./node_modules/handlebars/dist/handlebars.amd.min.js";

        // writing json
        fs.writeFileSync(
            this.destinationPath('config/config.json'),
            JSON.stringify(config, null, 2));


    }

    // Copy additional configuration file for editor support
    _addEditorSupport() {

        // Copy defaul configuration file for CSS Comb
        // URL: http://csscomb.com
        this.fs.copy(
            this.templatePath('editor/.csscomb.json'),
            this.destinationPath('.csscomb.json')
        );
    }

    // Add type support for Handlebars to tsconfiguration.json
    _addTypings() {

        // reading JSON
        let tsconfig = this.fs.readJSON(
            this.destinationPath('tsconfig.json')
        );

        // Add Handlebars entry
        tsconfig.compilerOptions.types.push('handlebars');

        // writing json
        fs.writeFileSync(
            this.destinationPath('tsconfig.json'),
            JSON.stringify(tsconfig, null, 2));


    }

    // Copy a blank handlbar template aka Hello World Web Part content
    _writingSampleCode() {

        this.fs.copy(
            this.templatePath('sample/src/templates/HelloWorld.hbs'),
            this.destinationPath('src/webparts/templates/HelloWorld.hbs')
        )

    }

    // install additional NPM packaged for jQuer, Handlbars, webpack loader ...
    _installNPMPackages() {

        var done = this.async();

        // Spawn dev dependencies
        this.npmInstall(['install',
            'handlebars-template-loader',
            'jquery'
        ], [
            '--save-dev',
            '--no-shrinkwrap'
        ]);

        // Spawn dependencies
        this.npmInstall(
            [
                'install',
                'handlebars',
                '@types/handlebars',
            ], [
                '--save',
                '--no-shrinkwrap'
            ]);

        done();

    }

}