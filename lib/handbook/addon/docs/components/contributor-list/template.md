# contributor-list


Displays a configurable list of contributor names.

## **Arguments**  

- **node**
*Node|Registration|Preprint*  
Node to which contributors belong  
Note: `showMore` link is disabled in case `node` is not provided.
- **useShowMoreLink**
*Boolean*  
Whether or not to use a link for `N more` or plain text
- **useContributorLink**
*Boolean*  
Whether or not to make contributor name a link (to their detail page).
- **useShowLess**
*Boolean*  
Whether or not to make the list retractable.
- **useLinks**
*Boolean*  
Whether or not to use links i.e set all `useShowMoreLink`, `useContributorLink`, `useShowLess`
at once.
- **showNonBibliographic**
*Boolean*  
Whether or not show `non-bibliographic` contributors
- **contribsPerPage**
*Number*  
Page size for `N more` requests
- **showLoading**
*Boolean*  
Whether or not to use `loading-indicator`
- **darkBall**
*Boolean*  
Whether or not to use the dark ball in the `loading-indicator`
- **showStep**
*Number*  
Number of contributors to show or add to already shown contributor list upon clicking `more`

## showNonBibliographic
{{docs/components/contributor-list/demo-show-non-bibliographic}}

## useShowMoreLink
{{docs/components/contributor-list/demo-show-more-link}}

## useContributorLink
{{docs/components/contributor-list/demo-show-contributor-link}}

## useLinks
{{docs/components/contributor-list/demo-use-links}}

## useShowLess
{{docs/components/contributor-list/demo-show-less}}

## showStep
{{docs/components/contributor-list/demo-show-step}}
