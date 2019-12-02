# osf-dialog

This is a dialog box! Use it for dialog boxes and modal popup things.

## Params
* `@onOpen` (optional)
    * callback called when the dialog is opened
* `@onClose` (optional)
    * callback called when the dialog is closed
* `@isOpen` (optional; default `false`)
    * allows opening/closing the dialog programatically, instead of putting a button in `<dialog.trigger>`
    * use along with `@onClose` action to close the dialog with `dialog.close`
* `@isModal` (optional; default `true`)
    * whether to block interaction with the rest of the app while the dialog is open
* `@closeOnOutsideClick` (optional; default `true`)
    * whether the dialog should close when the user clicks outside it
    * no effect when `@isModal` is `false`
* `@fixedWidth` (optional; default `false`)
    * whether to shrink width-wise to fit contents
* `@renderInPlace` (optional; default `false`)
    * whether the dialog should be rendered in place (instead of wormhole'd to the app root)
    * forwarded to [ember-wormhole](https://github.com/yapplabs/ember-wormhole#can-i-render-in-place-ie-unwormhole)

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

### Using `@isOpen`
Instead of using `<dialog.trigger>`, you can also open/close the dialog by passing `@isOpen`:
{{docs/components/osf-dialog/-components/demo-is-open}}

### No outside click
By default, `<OsfDialog>` will close when the user clicks outside. You can disable this behavior
with `@closeOnOutsideClick={{false}}`.
{{docs/components/osf-dialog/-components/demo-no-outside-click}}

### Non-modal dialogs
Use `@isModal={{false}}` to show a dialog that does not block interaction with the rest of the app.
{{docs/components/osf-dialog/-components/demo-non-modal}}
