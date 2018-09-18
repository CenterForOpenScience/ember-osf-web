# ancestry-display

Display node ancestry breadcrumbs  


## Arguments  

- **node** | <span style="color:red"> *required* </span>  
***Node***    
Current node  

- **useLinks** | <span style="color:blue"> *optional* </span>  
***Boolean***  
Whether to link ancestors of the current node  
Default: <code>false</code>  

- **delimiter** | <span style="color:blue"> *optional* </span>  
***String***  
Delimiter to use between node titles  
Default: <code>/</code>  


## No ancestor
{{docs/components/ancestry-display/demo-no-ancestor node=this.model.parent}}
## One ancestor
{{docs/components/ancestry-display/demo-one-ancestor node=this.model.child}}
## Two ancestors
{{docs/components/ancestry-display/demo-two-ancestors node=this.model.grandChild}}
## More than two ancestors
{{docs/components/ancestry-display/demo-two-plus-ancestors node=this.model.greatGrandChild}}
## delimiter
{{docs/components/ancestry-display/demo-delimiter node=this.model.grandChild}}
## useLinks
{{docs/components/ancestry-display/demo-use-links node=this.model.grandChild}}
