# How to…

## ember-cli
### Generate a component for OSF Components
Because engines, components shared across the site should be in an in-repo addon called `osf-components`. Therefore, to generate a component named `component-name`, you would use the command:

`ember g component -ir osf-components component-name`

### Test blueprints
To test all blueprints, use:

`yarn test:blueprints`

Or, if you just want to run a specific test:

`npx mocha ./node-tests/blueprints/handbook-component-test.js`
