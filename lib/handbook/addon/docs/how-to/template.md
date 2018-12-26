# How to…

## ember-cli
### Generate a component for OSF Components
Because engines, components shared across the site should be in an in-repo addon called `osf-components`. Therefore, to generate a component named `component-name`, you would use the command:

`ember g component -ir osf-components component-name`

### Test blueprints
These tests are run by mocha rather than qunit, so ensure that mocha is installed globally then:

`npx mocha ./node-tests/blueprints/*-test.js`

Or you can just choose the js file for the specific blueprint you want to test.