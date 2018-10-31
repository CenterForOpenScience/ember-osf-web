# contributor-list


Displays a configurable list of contributor names.

## **Arguments**  

- **node** | <span style="color:red"> *required* </span>  
*Node|Registration|Preprint*  
Node to which contributors belong  
Note: `showMore` link is disabled in case `node` is not provided.

- **useShowMoreLink** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to use a link for `N more` or plain text  
`useShowMoreLink=true` also shows `less` link when all available contributors are displayed.

- **useContributorLink** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to make contributor name a link (to their detail page).

- **showNonBibliographic** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not show `non-bibliographic` contributors

- **pageSize** | <span style="color:red"> *optional* </span>  
*Number*  
Page size for `N more` requests

- **showLoading** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to use `loading-indicator`

- **dark** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to use the dark ball in the `loading-indicator`

## showNonBibliographic
{{docs/components/contributor-list/demo-show-non-bibliographic node=this.model}}

## useShowMoreLink
{{docs/components/contributor-list/demo-show-more-link node=this.model}}

## useContributorLink
{{docs/components/contributor-list/demo-show-contributor-link node=this.model}}
