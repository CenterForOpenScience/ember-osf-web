# osf-button

Do you need a button, but not one of those super-fancy, do-it-all buttons like `DeleteButton`?
Then you should use `OsfButton`! You should definitely not use `BsButton` nor HTML's `<button>`.

Currently, `OsfButton` is a thin, thin wrapper on top of
[BsButton](https://www.ember-bootstrap.com/api/classes/Components.Button.html), so feel free to use
just like you'd use BsButton. We're using OsfButton so that, if we decide to make a break from
`ember-bootstrap` or even `bootstrap`, we won't have to change multiple things. Also, having our
own component will make it much easier to add functionality across all buttons, such as for accessibility
or style.

## demo
{{docs/components/osf-button/-components/demo}}
