# tags-widget

To show all of the tags associated with a file/project

## Parameters
- `taggable` (required): model instance with a `tags: string[]` attribute (e.g. `Node` or `File`)
- `readOnly`: boolean (default `true`)
    - when `false`, display controls for adding and removing tags
- `autoSave`: boolean (default `true`)
    - when `true`, call `taggable.save()` after a tag is added or removed
    - has no effect when `readOnly` is `true`
- `onChange(taggable)`: optional callback for when a tag is added or removed
- `analyticsScope`: optional string

## Demos

### Default
{{docs/components/tags-widget/-components/default node=this.taggable}}

### Writable
{{docs/components/tags-widget/-components/writable node=this.taggable}}
