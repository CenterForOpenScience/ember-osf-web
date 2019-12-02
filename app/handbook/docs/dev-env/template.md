# Developer Environment
## Local config

### Basic Setup

Add a file to your `ember-osf-web/config/` directory called `local.js`. This will hold your local overrides to ember-osf-web and will be ignored by git. Inside there, you want:

```
module.exports = {
};
```

Fill that up with overrides as described below and you can customize your ember experience to be more fulfilling and productive.

### Useful overrides

#### HANDBOOK_ENABLED
* **Type**: _boolean_
* **Default**: false

This thing you're reading right now? It's the handbook. If you'd like to be able to access it locally (especially for adding to the handbook or reviewing other developers' changes), set it to be true. If you have no need for it, set it to false.

#### MIRAGE_ENABLED
* **Type**: _boolean_
* **Default**: false

[Mirage](http://www.ember-cli-mirage.com) is a client-side API server that we use to mock the OSF API during automated testing. It can also be used for local development. Setting this to true will allow you to run the OSF front-end without having to run the OSF API back-end.

#### TESTS_ENABLED
* **Type**: _boolean_
* **Default**: false

This controls whether tests are included in `development` builds. Set this to `true` if you wish to run tests by accessing `/tests` when you `ember serve`.

#### A11Y_AUDIT
* **Type**: _boolean_
* **Default**: true (well, in develop mode)

[Ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing#ember-a11y-testing) provides warnings when we violate some easy-to-miss, easy-to-check accessibility issues. Be sure to check your pages for accessibility before sending it to CR or Demo, but sometimes there are a lot of warnings for things that we can't yet fix. If it gets to be too much, you can temporarily disable the audit with this flag.

#### POPULAR_LINKS_NODE
#### NEW_AND_NOTEWORTHY_LINKS_NODE
* **Type**: _string_

If you're doing local development with the OSF API running and want to see the New and Noteworthy and Popular sections of the Dashboard page filled out, then set each of these to the guid of a node in your local database that has links to other nodes. If you are not using a local OSF instance but are instead using Mirage, then you don't have to override these at all.