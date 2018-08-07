# Contributing to the Handbook

These pages are nice, friendly markdown files.
If you see anything you'd like to add or correct, just make a pull request!

## Editing a handbook page
Click "Edit this page" at the bottom of any handbook page to edit and submit a PR on GitHub.

Try it out on the {{#link-to 'docs.troubleshooting'}}troubleshooting page{{/link-to}} next
time you work through a problem.

## Running the handbook locally
See [the README](https://github.com/CenterForOpenScience/ember-osf-web#developer-handbook)
to enable the handbook at [localhost:4200/handbook](http://localhost:4200/handbook)

## Adding a new handbook page

1. Add a route to `lib/handbook/addon/routes.js`:
    ```js
    this.route('docs', function() {
        // ...
        this.route('my-new-page');
    }
    ```
1. Add a link to the sidebar nav in `lib/handbook/addon/docs/template.hbs`:
    ```hbs
    {{nav.item 'My new page' 'docs.my-new-page'}}
    ```
1. Let your thoughts fall into markdown at `lib/handbook/addon/docs/my-new-page/template.md`

> TODO: Add a generator to allow `ember g handbook-page my-new-page`


## Adding a component to the gallery
Follow the steps above to add a markdown page for your component at
`docs.components.my-component`, then use `{{docs-demo}}` to display your
component next to the actual code used to render it.

Check out the
{{#link-to 'docs.components.loading-indicator'}}`{{loading-indicator}}` demo{{/link-to}}
for a simple example.

> TODO: Make the default `component` generator add a placeholder to the component gallery
