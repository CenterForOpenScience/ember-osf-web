# validated-model-form
Helps build validated forms.

This component is appropriate if:
- You want a form for editing the fields on a model instance
- The model class has validations defined using `ember-cp-validations`

Renders a `<form>` element, provides tools to easily build that form, and handles
creating (if necessary), validating, and saving the model.

### Params
* `onSave(model)` (required): Action called after the model is successfully validated and saved.
* `onError(error, model)` (optional): Action called if saving the model fails.
* `onWillDestroy()` (optional): Action called if you transition. Default behavior is to unload the object.
* `model` (optional): Model instance to edit.
* `modelName` (optional): Name of the model to create.
* `modelProperties` (optional): Properties to be passed through to the model on creation.
* `recreateModel` (optional): Will create a new model instance upon saving.
* `disabled` (default `false`)
* `analyticsScope` (optional)

### Yielded hash
When invoked in block form, `validated-model-form` yields a hash with the following keys:

* `model`: The model instance being created/edited
* `disabled`: `true` when the model is being saved or the passed-in `disabled` param is `true`
* `submit`: Action to submit the form. Alternately, you can put a `<button type="submit">` in the form.
* Several `validated-input/*` components with common arguments (`model`, `shouldShowMessages`, `disabled`) already bound:
    * `checkbox`
    * `checkboxes`
    * `date`
    * `recaptcha`
    * `text`
    * `textarea`

## Demo: Create
{{docs/components/validated-model-form/demo-create onSave=(action this.onSave)}}

## Demo: Edit
This also shows how to use the `onWillDestroy()` action to bring up an "are you sure you want to leave" dialog if there are unsaved changes.

{{docs/components/validated-model-form/demo-edit onSave=(action this.onSave) onWillDestroy=(action this.onWillDestroy) node=this.existingNode}}
