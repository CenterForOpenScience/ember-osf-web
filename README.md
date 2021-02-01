# ember-osf-web

`master build`<a href="https://github.com/CenterForOpenScience/ember-osf-web/actions">
    <img alt="master build status" style="margin-bottom: -4px" src="https://github.com/CenterForOpenScience/ember-osf-web/workflows/CI/badge.svg?branch=master">
</a>
<a href="https://coveralls.io/github/CenterForOpenScience/ember-osf-web?branch=master">
    <img alt="Coverage Status" style="margin-bottom: -4px;" src="https://coveralls.io/repos/github/CenterForOpenScience/ember-osf-web/badge.svg?branch=master">
</a>

`develop build`<a href="https://github.com/CenterForOpenScience/ember-osf-web/actions">
    <img alt="develop build status" style="margin-bottom: -4px;" src="https://github.com/CenterForOpenScience/ember-osf-web/workflows/CI/badge.svg?branch=develop">
</a>
<a href="https://coveralls.io/github/CenterForOpenScience/ember-osf-web?branch=master">
    <img alt="Coverage Status" style="margin-bottom: -4px;" src="https://coveralls.io/repos/github/CenterForOpenScience/ember-osf-web/badge.svg?branch=develop">
</a>

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
