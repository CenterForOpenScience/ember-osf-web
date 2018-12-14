# link

This is a component for links! Whether you're linking to an external URL, a
route elsewhere in the app, or an anchor on this page, `<Link>` is
good for all your linking needs.

For transitions within the app, pass `@route` (and optionally `@models` and `@queryParams`).

For external links, pass `href`.

### Params
* `@route` (optional): Target route name (`.` delimited)
* `@models` (optional): Array of models or IDs that correspond to the target route's dynamic segments.
  The `{{array}}` helper is useful for constructing this in the template. Only used if `@route` is defined.
* `@queryParams` (optional): POJO with key/value pairs that will be serialized into query params.
  The `{{hash}}` helper is useful for constructing this in the template. Only used if `@route` is defined.
* `@onclick` (optional): Action that will be called on click. Be careful not to pass `onclick` (without `@`),
  or the default click handler will be clobbered!

### Yielded hash
In block form, yields a hash with the following properties:
* `active`: `true` if the current page is the target route or one of its children

## Route transitions
{{docs/components/link/-components/demo-internal}}

## External links
{{docs/components/link/-components/demo-external}}

## Click handler
{{docs/components/link/-components/demo-onclick}}
