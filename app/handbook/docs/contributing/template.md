# Contributing to the Handbook

These pages are nice, friendly markdown files.
If you see anything you'd like to add or correct, just make a pull request!

## Editing a handbook page
Click "Edit this page" at the bottom of any handbook page to edit and submit a PR on GitHub.

Try it out on the <OsfLink @route='docs.troubleshooting'>troubleshooting page</OsfLink> next
time you work through a problem.

## Running the handbook locally
See [the README](https://github.com/CenterForOpenScience/ember-osf-web#developer-handbook)
to enable the handbook at [localhost:4200/handbook](http://localhost:4200/handbook)

## Adding a component to the gallery
1. Use `ember g handbook-component my-component` to add a route and demo component:
    ```
    lib/handbook/addon/docs/components/my-component/
    ├── -components
    │   └── demo
    │       └── template.hbs
    └── template.md
    ```
1. Describe the component and its usage in `template.md`.
1. Expand on the live demo in `demo/template.hbs`
    - Uses the [docs-demo](https://ember-learn.github.io/ember-cli-addon-docs/docs/components/docs-demo)
        component from [ember-cli-addon-docs](https://ember-learn.github.io/ember-cli-addon-docs).
    - You can add `demo/component.ts` or `demo/styles.scss` if you need.
    - Add more demos! Show the component in a variety of states.
    - Check out the
    {{#link-to 'docs.components.loading-indicator'}}loading-indicator demos{{/link-to}}
    for a simple example.

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
