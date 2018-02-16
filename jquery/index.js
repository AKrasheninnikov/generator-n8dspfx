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
    prompting() {
    }

    // adds additonal editor support in this case CSS Comb
    configuring() {
    }

    // not used because of the dependencies of the SPFx file
    // Code was moved to Install
    writing() {
        
    }

    install() {

        // Adding externals      
        this._addExternals();
        // add additional typings
        this._addTypings();

        // Install additional NPM Packages
        this._installNPMPackages();
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

    // reference external in config.json automatically
    _addExternals() {

        // "handlebars": "./node_modules/handlebars/dist/handlebars.amd.min.js"
        // reading JSON
        let config = this.fs.readJSON(this.destinationPath('config/config.json'));

        // Add Handlebars entry
        config.externals.handlebars = "./node_modules/jquery/dist/jquery.js";

        // writing json
        fs.writeFileSync(
            this.destinationPath('config/config.json'),
            JSON.stringify(config, null, 2));


    }

    // install additional NPM packaged for jQuer, Handlbars, webpack loader ...
    _installNPMPackages() {

        // Spawn dev dependencies
        this.spawnCommand('npm', ['install',
            'handlebars-template-loader',
            'jquery',
            '--save-dev'
        ]);


    }

}