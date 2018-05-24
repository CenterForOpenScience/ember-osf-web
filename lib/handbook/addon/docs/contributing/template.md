# How to Contribute

Make a PR!

## Running the handbook locally
1. Add the following to your `ember-osf-web/config/local.js`:
    ```js
    module.exports = {
        HANDBOOK_ENABLED: true,
    };
    ```
1. Add `/handbook/` to the `routes` list in `osf.io/website/ember_osf_web/views.py`
1. Go to `localhost:5000/handbook/`

## Adding a handbook page
These pages are nice, friendly markdown files that live in `lib/handbook/addon/docs/`.
To add a new page:

1. Add a route to `lib/handbook/addon/routes.js`:
    ```js
    this.route('docs', function() {
        // ...
        this.route('my-new-page');
    }
    ```
1. Add a link to the sidebar nav in `lib/handbook/addon/docs/template.hbs`:
    ```hbs
    {{#docs-viewer as |viewer|}}
        {{#viewer.nav project=model as |nav|}}
            [...]
            {{nav.item 'My new page' 'docs.my-new-page'}}
        {{/viewer.nav}}
    {{/docs-viewer}}
    ```
1. Let your thoughts fall into markdown at `lib/handbook/addon/docs/my-new-page/template.md`

## Adding a component to the gallery
Follow the steps above to add a markdown page for your component at
`docs.components.my-component`, then use `{{docs-demo}}` to display your
component next to the actual code used to render it.

Check out the
{{#link-to 'docs.components.loading-indicator'}}`{{loading-indicator}}` demo{{/link-to}}
for a simple example.


## Docs TODO
- Fill out all the docs pages with useful info
- Add more components to the component gallery
- Improve auto-generated API reference
    - Move to another section, a second link in the header
    - Add `@ignore` to things that shouldn't be there
    - Add docstrings to more stuff
    - Fix import paths (`app/models/...` should be `ember-osf-web/models/...`)
    - Component arguments aren't internal
- Easy deployment to Github Pages
- Enable lazy loading
- Fix bugs
    - Intermittent error on rebuild?
    - Weird search result rendering problem (type "universe" slowly)
