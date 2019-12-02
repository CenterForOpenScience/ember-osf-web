# osf-link

This is a component for links! Whether you're linking to an external URL, a
route elsewhere in the app, or an anchor on this page, `<OsfLink>` is
good for all your linking needs.

For transitions within the app, pass `@route` (and optionally `@models` and `@queryParams`).

For external links, pass `@href`.

### Params
* `@route`
    * Target route name (`.`-delimited)
    * Cannot be used with `@href`
* `@href`
    * Target URL
    * Cannot be used with `@route`
* `@models` (optional)
    * Array of models or IDs that correspond to the target route's dynamic segments
    * The `{{array}}` helper is useful for constructing this in the template
    * Used only with `@route`
* `@queryParams` (optional)
    * POJO with key/value pairs that will be serialized into query params
    * The `{{hash}}` helper is useful for constructing this in the template
    * Used only with `@route`
* `@fragment` (optional)
    * String to use as the URL fragment (the part after `#`)
    * Used only with `@route`
* `@onClick` (optional)
    * Action called on click
    * Be careful not to pass `onClick` (no `@`) or the default click handler will be clobbered
    * Also be careful not to call `@onclick` (all lower case) as that's not a parameter

### Yielded hash
In block form, yields a hash with the following properties:
* `active`: `true` if the current page is the target route or one of its children

## Internal link
{{docs/components/osf-link/-components/demo-internal}}

## External link
{{docs/components/osf-link/-components/demo-external}}

## Click handler
{{docs/components/osf-link/-components/demo-onclick}}
