'use strict';
// base generator scaffolding
const Generator = require('yeoman-generator');

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
    initializing() {}

    // Prompt for user input for Custom Generator
    prompting() {

        const prompts = [{
            type: 'list',
            name: 'features',
            message: 'What features you like to use?',
            choices: [{
                name: 'jQuery',
                value: 'jquery'
            }, {
                name: 'Handlebars',
                value: 'hbs'
            }]
        }];

        return this.prompt(prompts).then(answers => {
            // const features = answers.features;

            this.features = answers.features
        });
    }

    // adds additonal editor support in this case CSS Comb
    configuring() {
        switch (this.features) {
            case 'jquery':
                this.composeWith('n8dspfx:jquery', {}, {
                    local: require.resolve('../jquery')
                });
                break;
            case 'hbs':
                this.composeWith('n8dspfx:hbs', {}, {
                    local: require.resolve('../hbs')
                });
                break;
            default:
                break;
        }
    }

    // not used because of the dependencies of the SPFx file
    // Code was moved to Install
    writing() {}

    install() {}

    // Run installer normally time to say goodbye
    // If yarn is installed yarn will be used
    end() {}

}