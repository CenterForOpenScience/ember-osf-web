# ember-osf-web

[![Greenkeeper badge](https://badges.greenkeeper.io/CenterForOpenScience/ember-osf-web.svg)](https://greenkeeper.io/)

`master` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf-web.svg?branch=master)](https://travis-ci.org/CenterForOpenScience/ember-osf-web)
[![Coverage Status](https://coveralls.io/repos/github/CenterForOpenScience/ember-osf-web/badge.svg?branch=master)](https://coveralls.io/github/CenterForOpenScience/ember-osf-web?branch=master)

`develop` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf-web.svg?branch=develop)](https://travis-ci.org/CenterForOpenScience/ember-osf-web)
[![Coverage Status](https://coveralls.io/repos/github/CenterForOpenScience/ember-osf-web/badge.svg?branch=develop)](https://coveralls.io/github/CenterForOpenScience/ember-osf-web?branch=develop)

A front end for [osf.io](https://github.com/CenterForOpenScience/osf.io).

## Prerequisites

You will need the following things properly installed on your computer.

* [osf.io back end](https://github.com/CenterForOpenScience/osf.io)
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone https://github.com/CenterForOpenScience/ember-osf-web.git`
* `cd ember-osf-web`
* `yarn --frozen-lockfile`

## Running / Development

* `ember serve`
* View the ember app (alone) at [localhost:4200](http://localhost:4200)

To integrate with the legacy front end at [localhost:5000](http://localhost:5000), you have two options:
* Enable the waffle flags for each page in your [local OSF Admin](http://localhost:8001/admin/waffle/flag)
* Add routes to your `osf.io/website/settings/local.py`:
    ```py
    EXTERNAL_EMBER_APPS = {
        'ember_osf_web': {
            # ...
            'routes': [
                'handbook',
                'dashboard',
                # ...
            ],
        },
        # ...
    ```

### Developer Handbook

To enable the [developer handbook](https://centerforopenscience.github.io/ember-osf-web/handbook) locally,
add the following to your `config/local.js`:
```
module.exports = {
    HANDBOOK_ENABLED: true,
};
```
The handbook will be available at [http://localhost:4200/handbook](http://localhost:4200/handbook).

To enable (experimental) auto-generated docs in the handbook, you can also set
`HANDBOOK_DOC_GENERATION_ENABLED: true` in your local config.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
