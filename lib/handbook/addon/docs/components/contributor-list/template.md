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

- **useContributorLink** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to make contributor name a link (to their detail page).

- **useShowLess** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to make the list retractable.

- **showNonBibliographic** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not show `non-bibliographic` contributors

- **contribsPerPage** | <span style="color:red"> *optional* </span>  
*Number*  
Page size for `N more` requests

- **showLoading** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to use `loading-indicator`

- **ball** | <span style="color:red"> *optional* </span>  
*Boolean*  
Whether or not to use the dark ball in the `loading-indicator`

- **showStep** | <span style="color:red"> *optional* </span>  
*Number*  
Number of contributors to show or add to already shown contributor list upon clicking `more`

## showNonBibliographic
{{docs/components/contributor-list/demo-show-non-bibliographic contributorList=this.contributorList node=this.nodeWithNonBibliographic}}

## useShowMoreLink
{{docs/components/contributor-list/demo-show-more-link node=this.node}}

## useContributorLink
{{docs/components/contributor-list/demo-show-contributor-link node=this.node}}

## useShowLess
{{docs/components/contributor-list/demo-show-less node=this.node}}

## showStep
{{docs/components/contributor-list/demo-show-step node=this.node showStep=this.showStep bumpStep=(action this.bumpStep) resetStep=(action this.resetStep)}}
