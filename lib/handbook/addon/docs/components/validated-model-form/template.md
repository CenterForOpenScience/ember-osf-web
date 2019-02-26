# validated-model-form
Helps build validated forms.

This component is appropriate if:
- You want a form for editing the fields on a model instance
- The model class has validations defined using `ember-cp-validations`

Renders a `<form>` element, provides tools to easily build that form, and handles
creating (if necessary), validating, and saving the model.

### Params
* `onSave(changeset)` (required): Action called after the model is successfully validated and saved.
* `onError(error, changeset)` (optional): Action called if saving the model fails.
* `onWillDestroy()` (optional): Action called if you transition.
* `onDirtChange(dirt: Boolean)` (optional): Action called When validation is run to pass along `changeset.isDirty`.
* `model` (optional): Model instance to edit. A changeset will be created to match.
* `changeset` (optional): Changeset to use for this form. Without this, the form will create a changeset from the model.
* `modelName` (optional): Name of the model to create.
* `modelProperties` (optional): Properties to be passed through to the model on creation.
* `recreateModel` (optional): Boolean to initiate creating a new model instance upon saving.
* `disabled` (default `false`)

### Yielded hash
When invoked in block form, `validated-model-form` yields a hash with the following keys:

* `model`: The model instance being created/edited.
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
{{docs/components/validated-model-form/demo-create
    onSave=(action this.onSave)
    changeDirtCreateForm=(action this.changeDirtCreateForm)
}}

## Demo: Edit
This also shows how to use the `rollback`, `onDirtChange()`, `onWillDestroy()`, and `onSave()` actions.

{{docs/components/validated-model-form/demo-edit
    onSave=(action this.onSave)
    onWillDestroy=(action this.onWillDestroy)
    node=this.existingNode
    changeDirtEditForm=(action this.changeDirtEditForm)
}}
