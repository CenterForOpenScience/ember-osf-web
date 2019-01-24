# tags-widget

To show all of the tags associated with a file/project

## Parameters
- `taggable` (required): model instance with a `tags: string[]` attribute (e.g. `Node` or `File`)
- `readOnly`: boolean (default `true`)
    - when `false`, display controls for adding and removing tags
- `autoSave`: boolean (default `true`)
    - when `true`, call `taggable.save()` after a tag is added or removed
    - has no effect when `readOnly` is `true`
- `inline`: boolean (default `false`)
    - when `true`, render as inline-block instead of block
- `shouldSearchOnClick`: boolean (default `false`)
    - when `true`, each tag is a link to search for other objects with that tag
- `onChange(taggable)`: optional callback for when a tag is added or removed
- `analyticsScope`: optional string

## Demos

### Default
{{docs/components/tags-widget/default node=this.taggable}}

### Writable
{{docs/components/tags-widget/writable node=this.taggable}}

### Inline
{{docs/components/tags-widget/inline node=this.taggable}}

### Inline writable
{{docs/components/tags-widget/inline-writable node=this.taggable}}
