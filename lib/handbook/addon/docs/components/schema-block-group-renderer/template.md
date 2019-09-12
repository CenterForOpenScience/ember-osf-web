# SchemaBlockGroupRenderer

To be used with Registries submission forms.  Given a schema group and a changeset will output a list of validated-inputs.

### Components

- `page-heading`: an `<h1>` element that renders a heading for the page
- `section-heading`: `<h2>` heading for a specific section
- `subsection-heading`: `<h3>` heading for a specific section
- `paragraph`: a `<p>` element that contains more information on the section or question
- `label`: the title for the question block
- `text`: renders a `textbox` input
- `textarea`: renders a `textarea` input

## Default
{{docs/components/schema-block-group-renderer/-components/default
    schemaGroups=this.schemaGroups
}}