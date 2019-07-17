# osf-dialog

This is a dialog box! Use it for dialog boxes and modal popup things.

## Params
* `@closeOnOutsideClick` (optional; default `true`)
    * whether the dialog should close when the user clicks outside it
* `@renderInPlace` (optional; default `false`)
    * whether the dialog should be rendered in place (instead of wormhole'd to the app root)
    * forwarded to [ember-wormhole](https://github.com/yapplabs/ember-wormhole#can-i-render-in-place-ie-unwormhole)
    * good in integration tests, but generally shouldn't be used in real life
* `@isModal` (optional; default `true`)
    * whether the dialog should be *modal*, i.e. will block interaction with controls in the background

## Yielded hash
Invoked as `<OsfDialog as |dialog|>`, the yielded hash `dialog` provides the following:

### Actions
* `dialog.open`
    * open the dialog
    * only usable in the `dialog.trigger` block
* `dialog.close`
    * close the dialog
    * only usable in the `dialog.heading`, `dialog.main`, and `dialog.footer` blocks

### Blocks
* `<dialog.trigger>`
    * rendered as-is where `<OsfDialog>` is invoked
    * meant to hold a button that opens the dialog
* `<dialog.heading>`
    * heading of the dialog, including a close button in the top corner
* `<dialog.main>`
    * main body of the dialog
* `<dialog.footer>`
    * footer of the dialog
    * meant for buttons, automatically aligned right

## Examples

### Small dialog
`<OsfDialog>` will shrink to fit its contents:
{{docs/components/osf-dialog/-components/demo-little}}

### Large dialog
`<OsfDialog>` will grow to fit its contents, but will never grow larger than the browser viewport:
{{docs/components/osf-dialog/-components/demo-big}}

### No outside click
By default, `<OsfDialog>` will close when the user clicks outside. You can disable this behavior
with `@closeOnOutsideClick={{false}}`.
{{docs/components/osf-dialog/-components/demo-no-outside-click}}
