# contributor-list

Displays a configurable list of contributor names.

Owns the `contributor` relationship of the passed-in `node`.

## Parameters

- `node` *Node|Registration|Preprint*
    - (required) Node to which contributors belong
- `shouldTruncate` *boolean*
    - If `true` (default), display a short list (only 3 contributors, only family names, no button to load more).
    - If `false`, display a long list (full page of 10 contributors, full names, button to load additional pages).
- `shouldLinkUsers` *boolean*
    - If `true`, each contributor's name is a link to their user profile (except unregistered contributors).
    - If `false` (default), names are plain text.

## Demos

Number of contributors:
{{#power-select
    options=this.contributorCountOptions
    selected=this.contributorCount
    onchange=(action (mut this.contributorCount))
    searchEnabled=false
    as |count|
}}
    {{count}}
{{/power-select}}


### default usage
{{docs/components/contributor-list/-components/demo-default node=this.node}}

### links
{{docs/components/contributor-list/-components/demo-links node=this.node}}

### untruncated
{{docs/components/contributor-list/-components/demo-untruncated node=this.node}}
