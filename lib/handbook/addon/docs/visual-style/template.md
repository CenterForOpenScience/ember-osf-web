# Visual Style

## General principles
These are general guidelines that developers need to keep in mind when developing user interactions. They identify our priorities and UI development needs to take into consideration these principles.

### Let the user know about state where applicable
When a state change in the UI is happening the user should be notified of some of these processes where it helps the user understand what's going on and differentiate the situation from a potential unresponsive or erroneous scenario.

#### Some examples:

- Items that are actionable need to be visually distinct (e.g. links, buttons, draggable items).
- Pending processes should be identified if taking too long. Pending processes are events that are expected to take a little time, anything that is expected to be observable by the user. For instance uploads and most saves have pending status while the action if being completed. Most often ajax call require the consideration for pending events since they include communication with server. How long after the action starts to show the message is up to the developer and varies considerably. The important point is to match user expectation about time and make sure they know what's going on.
- When page loads if there are still asynchronous components loading, a loading indicator needs to make that clear.
- Normally actionable items that are non-actionable should be muted (greyed out).
- Tooltips should be used to explain states that do not otherwise make sense.
- Actionable items should be protected against multiple hits (e.g. Delete buttons turning to muted Deleting...).
- If using active states, the active component needs to be visually distinct, for instance in buttons, panels, tabs.
- Toggle buttons should change to reflect the current state. For instance a collapsed item should have an icon that suggests opening and that icon should change when the state needs to suggest closing.
- Utilize the [cursor attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) of CSS to change cursors on hover but only when this change makes sense. 
  - default is for general purpose.
  - pointer is for links and items that are clickable.
  - move is for items that can be moved with drag already.
  - row/col-resize To drag and resize horizontal or vertical items, content.

### Let the user know about errors and offer alternatives where possible
Sometimes user driven or connectivity based errors halt or make certain UI actions possible. The interface should provide alternatives and information

Example with space limitation

> Can't connect to Dropbox at the moment. [Learn more]


Example

> We are having trouble connecting to the Dropbox server at the moment. 
> This may be because their servers are not reachable or your internet connection may be down. 
> Please try reloading this page or [read more about this error]


### Be consistent about UI components
To the greatest extent possible, all our components should be using the exact same styling by using the OSF Style Guidelines. This means:

- Buttons should look exactly the same in style, with color differences denoting similar meaning.
- Color palette should be used in similar ways; (e.g. we should have a single highlight background color for all hover effects)
- Element use for common tasks should be the same, e.g. different sections within pages should not use tabs in one place and accordion menus in others if the target elements are exactly the same.
- Different icons should not be used to mean the same thing and one icon should not be used for multiple meanings. Icon association should make sense to the task.
- Responsive components should become responsive in similar ways. For instance if icons lose their labels in small views, that should be the case with all icons.

### Utilize empty space with actionable suggestions
There are many areas where users don't have content available. In these cases their pages or elements will be empty. We can use these instances to offer actionable tasks with appropriate links.

Example:

> You don't have any registrations at the moment.
> [Learn more about Registrations] [Create a Registration]


### Take steps to make website functional in mobile devices
- Check [responsiveness](http://www.smashingmagazine.com/2011/01/12/guidelines-for-responsive-web-design/) in every page.
- Make Header texts proportionally smaller in smaller devices, no need for an H1 in a phone.
- Make text that does not fit constrained widths end with ...
- Make different versions for mobile buttons that have less text. - Make sure all images are responsive.
- Check show/hide relationships in mobile devices, often it's unnecessary.
- Check empty vertical space in rows.
- Check that horizontally listed items stack properly in narrow view.
- Check that tables respond properly to narrow views, scrolling if necessary.
- Make sure touch and event based actions either work well or have fallbacks in mobile devices.

### Take steps to make sure the website is functional in very large devices
Where possible, let the user utilize the large workspace that they have by providing meaningful expansion of the space:

- Expand tables, grids, and stacked components that have uniform items (e.g. galleries).
- Do not expand Text! Instead fit several columns.
- Remove show/hide options to show everything as space allows, that reduces an extra step.
- Stack similar content horizontally as columns.
- Center content if not utilizing the entire width.

### Improve the form input and toggle process where possible
Follow these guidelines when making forms or add elements such as drop downs.

- If your dropdown has few elements, consider another input or toggle method, like a button group or radio buttons.
- Make input elements large and text visible.
- Uniformity in input elements is important, stick to themes or frameworks; if you are adding custom css to established framework css for inputs you are most likely doing it wrong.
- Do not remove the visual separation of focus on input elements, but make it fit to your general theme.
- Most of the time select and checkbox items are too small, consider increasing their size or generally make sure they fill your font's line height.
- Make sure tab goes to the next item if there is a form with multiple items.
- If using JS for form inputs, bind Enter key.
- Don't have a "Clear Form" button.
- Avoid using too many borders in form structures. Alignment is a way to denote edges as well and inputs already have borders.
- Use a good combination of placeholder and label for inputs, often one is enough, both are unnecessary. Don't repeat the label in the placeholder. Label is better for cross browser use.
- Tie your labels to your form elements with "for" so that when users click on the label the input gets selection.

### Ignore these rules when necessary
There are times where these general practices may not make sense for rare instances. In those cases it is better UI practice to abandon convention and use custom solutions. These cases should be few and should require discussion.

