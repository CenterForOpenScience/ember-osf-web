# form-controls
Takes a changeset and yields validated form components

### Params
The only param that `<FormControls />` takes is a changeset for the current form being created

### Yielded hash
When invoked in a form, `<FormControls />` yields a hash with the following keys:

* Several `validated-model-form/*` components with common arguments (`model`, `changeset`, `shouldShowMessages`, `disabled`) already bound:
    * `checkbox`
    * `checkboxes`
    * `date`
    * `recaptcha`
    * `text`
    * `textarea`

## Demo: Default
{{docs/components/form-controls/demo-default
    submit=(action this.submit)
    changeset=this.changeset
}}

## Demo: Disabled
{{docs/components/form-controls/demo-disabled
    submit=(action this.submit)
    changeset=this.changeset
}}