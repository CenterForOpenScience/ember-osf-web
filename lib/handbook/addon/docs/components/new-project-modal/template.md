# new-project-modal

If you need to create a node where the user gets to name it, you should use this component. This gives the user the ability to pick institutions, storage region, and even where to template the node from. 

## parameters
### projectCreated 
An action you pass in that it to call when it creates a project. This is a good opportunity to set a property with the node that you just created on it.
### page
A string passed to the analytics service. Should be the name you're using for the current page in your other analytics calls.
### closeModal
An action you pass in to handle clean-up things related to the modal closing. Useful for hiding the div that contains the dialog box and passing information about whether to reload a list.

## demo
{{docs/components/new-project-modal/demo projectCreated=this.projectCreated closeModal=this.closeModal openModal=this.openModal}}