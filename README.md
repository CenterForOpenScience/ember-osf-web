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
* [Watchman](https://facebook.github.io/watchman/)

## Installation

* `git clone https://github.com/CenterForOpenScience/ember-osf-web.git`
* `cd ember-osf-web`
* `yarn --frozen-lockfile`

## Running / Development

### Mac OS File Descriptor Limits

Watchman [states](https://facebook.github.io/watchman/docs/install.html#mac-os-file-descriptor-limits) "*Only applicable on OS X 10.6 and earlier*". Though it's been observed this setting can remain incorrect on systems where the operation system was upgraded from a legacy version.

> Putting the following into a file named /etc/sysctl.conf on OS X will cause these values to persist across reboots:

```bash
kern.maxfiles=10485760
kern.maxfilesperproc=1048576
```

### Development

Configure the application for local development, add the following to your `config/local.js`:
```ts
module.exports = {
    // an ally audit can use 100% of your browsers cpu, so use it wisely
    A11Y_AUDIT: false,
    // toggle on/off the engine applications you will be working on
    COLLECTIONS_ENABLED: false,
    // sourcemaps are useful if you need to step through typescript code in the browser
    SOURCEMAPS_ENABLED: true,
};
```

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
```ts
module.exports = {
    HANDBOOK_ENABLED: true,
};
```
The handbook will be available at [http://localhost:4200/handbook](http://localhost:4200/handbook).

To enable (experimental) auto-generated docs in the handbook, you can also set
`HANDBOOK_DOC_GENERATION_ENABLED: true` in your local config.

#### Enable handbook on your fork

1. [Generate a deploy key](https://developer.github.com/v3/guides/managing-deploy-keys/)
  * `ssh-keygen -t rsa -b 4096 -C <your@email.com>`
  * Enter file in which to save the key (~/.ssh/id_rsa): `~/deploy_key`
  * Press enter twice for no passphrase
2. Add the public key in your GitHub repository settings
  * `cat ~/deploy_key.pub | pbcopy`
  * Go to `https://github.com/<org>/<repo>/settings/keys/new`
  * Title: `Travis CI`
  * Key: paste in the public key
  * ☑️ Allow write access
3. Add the base64-encoded private key to Travis CI
  * `cat ~/deploy_key | base64 | pbcopy`
  * Go to `https://travis-ci.org/<org>/<repo>/settings`
  * Under Environment Variables, add
    * Name: `DEPLOY_KEY`
    * Value: paste in the private key
    * 'Leave Display Value in Build log' off
    * Click Add
4. Delete the keypair
  * `rm ~/deploy_key ~/deploy_key.pub`

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
