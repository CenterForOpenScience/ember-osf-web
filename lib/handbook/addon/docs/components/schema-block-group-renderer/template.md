# SchemaBlockGroupRenderer

To be used with Registries submission forms.  Given a schema group, changeset and a node will output a list of validated-inputs.

### Components

- `page-heading`: an `<h1>` element that renders a heading for the page
- `section-heading`: `<h2>` heading for a specific section
- `subsection-heading`: `<h3>` heading for a specific section
- `paragraph`: a `<p>` element that contains more information on the section or question
- `label`: the title for the question block
- `text`: renders a `textbox` input
- `textarea`: renders a `textarea` input
- `single-select-input`: renders a select dropdown
- `multi-select-input`: renders a list of checkboxes
- `read-only-contributor-list`: a list of contributors with an edit link going back to the project's contributors page


## Editable
{{docs/components/schema-block-group-renderer/-components/editable
    schemaBlockGroups=this.schemaBlockGroups
    changeset=this.registrationResponseChangeset
    node=this.model
}}

## Read-only
{{docs/components/schema-block-group-renderer/-components/read-only
    schemaBlockGroups=this.schemaBlockGroups
    registrationResponses=this.registrationResponses
    node=this.model
}}