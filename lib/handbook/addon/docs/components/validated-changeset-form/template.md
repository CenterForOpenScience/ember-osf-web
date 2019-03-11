# validated-changeset-form
Helps build validated forms without necessarily needing a model.

This component is appropriate if:
- You want a form
- You have defined validations specific for that form

Renders a `<form>` element, provides tools to easily build that form, and handles
creating (if necessary), validating, and saving the model.

### Params
* `changeset` (required): Changeset to use for this form.
* `onSave(changeset)` (required): Action called after the model is successfully validated and saved.
* `onError(error, changeset)` (optional): Action called if saving the model fails.
* `onWillDestroy()` (optional): Action called if you transition.
* `onDirtChange(dirt: Boolean)` (optional): Action called When validation is run to pass along `changeset.isDirty`.
* `disabled` (default `false`)

### Yielded hash
When invoked in block form, `validated-model-form` yields a hash with the following keys:

* `changeset`: The changeset for this particular form.
* `disabled`: `true` when the model is being saved or the passed-in `disabled` param is `true`.
* `rollback`: Action to allow the form components to rollback the changes
* `submit`: Action to submit the form. Alternately, you can put a `<button type="submit">` in the form.
* Several `validated-input/*` components with common arguments (`model`, `changeset`, `shouldShowMessages`, `disabled`) already bound:
    * `checkbox`
    * `checkboxes`
    * `date`
    * `recaptcha`
    * `text`
    * `textarea`

## Demo: Create
{{docs/components/validated-changeset-form/demo-create
    onSave=(action this.saveNew)
    node=this.emptyNode
    changeDirtCreateForm=(action this.changeDirtCreateForm)
}}

## Demo: Edit
This also shows how to use the `rollback`, `onDirtChange()`, `onWillDestroy()`, and `onSave()` actions.

{{docs/components/validated-changeset-form/demo-edit
    onSave=(action this.saveExisting)
    onWillDestroy=(action this.onWillDestroy)
    node=this.existingNode
    changeDirtEditForm=(action this.changeDirtEditForm)
}}
