# new-project-modal

If you need to create a node where the user gets to name it, you should use this component. This gives the user the ability to pick institutions, storage region, and even where to template the node from. 

## parameters
* `afterProjectCreated` (required):
An action you pass in that it calls when it creates a project. This is a good opportunity to set a property with the node that you just created on it.
* `closeModal` (required):
Passed to `bs-modal`'s `onHidden` parameter.

## demo
{{docs/components/new-project-modal/demo 
    projectCreated=this.projectCreated
    closeModal=this.closeModal
    openModal=this.openModal
}}