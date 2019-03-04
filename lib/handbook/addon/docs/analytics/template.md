# Analytics
- Every meaningful user action should be tracked
- Adding tracking should be easy
- Forgetting to add tracking should be hard

## Tracking clicks automatically
Tracking clicks is as easy as adding a few `data-` attributes.

### `data-analytics-name`
If an element is named with a `data-analytics-name` attribute, click events on that element will be tracked:
```hbs
<OsfButton
    data-analytics-name='Create new project'
    onClick={{action ... }}
>
    Create new project
</OsfButton>
```

### `data-analytics-scope`
Use named scopes to provide more context with the event, like on which page or region of the page the event took place.
For example, a click on the button below will be tracked with the label "Dashboard - Control bar - Create new project":
```hbs
<div data-analytics-scope='Dashboard'>
    <div data-analytics-scope='Control bar'>
        <button data-analytics-name='Create new project'></button>
    </div>
</div>
```

**Note**: To scope a `BsModal` you have to add the scope in the `modal.header`, `modal.body`, and/or `modal.footer` blocks,
as appropriate. If you don't, the events won't track, because the modal is in a wormhole, and the wormhole pulls the dom
outside of the surrounding page information

### `data-analytics-category`
The event category generally refers to the type of thing being acted upon. For normal links (`<a>` or `role='link'`)
and buttons (`<button>` or `role='button'`) the category will be inferred as `link` and `button`, respectively.

If you want to categorize events another way (e.g. `file` for all events that act on file objects), you can add
`data-analytics-category='mycategory'` to the same element with `data-analytics-name`:
```hbs
<OsfButton
    data-analytics-name='Delete file'
    data-analytics-category='file'
    @onClick={{action this.deleteFile file}}
>
    Delete file
</OsfButton>
```

### `data-analytics-extra`
You can optionally fill in the `extra` field on the tracked event by setting `data-analytics-extra='extra data'`:
```hbs
<OsfButton
    data-analytics-name='Delete file'
    data-analytics-category='file'
    data-analytics-extra={{concat 'File name: ' file.name}}
    @onClick={{action this.deleteFile file}}
>
    Delete file
</OsfButton>
```

## Tracking events by hand
<aside>
    Note: It is currently easy to forget to track non-click events.
    Until we figure out a more automatic approach, try not to forget.
</aside>

For non-click events, or when the "automatic" approach doesn't fit, call `track()` on the `analytics` service:

```ts
@action
onKeyUp() {
    this.analytics.track('search', 'keyUp', 'Search box - Key up');
    // ...
}
```

Params for `track()`:
- `category`: string
- `actionName`: string
- `label`: string
- `extraInfo` (optional): string

## Tracking page views
<aside>
    Note: It is currently easy to forget to add page tracking.
    Until we figure out a more automatic approach, try not to forget.
</aside>

Call `trackPage()` on the `analytics` service in the `didTransition` hook for your route or a parent route:
```ts
// route.ts
@action
didTransition() {
    this.analytics.trackPage();
}
```

If the page is under a GUID route, pass the following two arguments to `trackPage`:
- `pagePublic`: boolean indicating whether the GUID referent is public or private
- `resourceType`: string for the API type of the GUID referent (e.g. `nodes`, `registrations`, etc.)

## Testing analytics
Any action worth testing is worth tracking, and vice versa.

### Custom `click` helper
The custom `click` helper will error if its target does not have a `data-analytics-name` attribute.
Use it in all your tests for pages/components that use the "automatic" analytics approach.

```ts
import { click } from 'ember-osf-web/tests/helpers';
// ...
await click('button');
```

### Manual testing
In development builds, events that would be tracked are logged to the console.

In addition, you can click on the "development mode" banner in the lower left to open dev options.
Check "Display toast for tracked events" to display a toast for tracked events.
