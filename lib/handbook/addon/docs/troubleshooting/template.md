# Troubleshooting

So you're trying to do a thing and that thing turns into trouble!
This page is a portal to the past -- with luck, someone has already
encountered your trouble and recorded how they shot it.

What should you do?
1. Take a moment to look out the window, breathe, and remember that
the only meaning that exists is that which we create for ourselves.
2. Read the rest of this page and take actions that seem appropriate.
If you solve your problem, skip to step 4.
3. Well, this portal can't help you. Try asking the Internet and/or individual
people for help. When you solve your problem, come back here and:
4. Pass your understanding into the future. Edit this page to add anything
you learned that seems useful to future devs in your place. Try to be clear,
concise, and considerate that their situation will not be exactly the same
as yours.

## Basic troubleshooting steps
* Have you run `yarn` lately?
* Have you tried turning it off and on again? Restart `ember server` and/or
your `api`/`web` containers, depending on the problem.
* Check out the latest `develop` (or rebase/merge your branch with it),
see if your trouble still exists.

## Waffle trouble
Waffle flags are cached, apparently. After you change them in the OSF admin,
it can take a few minutes for that change to be reflected in the API and the
web server's routing decisions. If you see an infinite reload loop, it's
probably this.

Check that `meta.active_flags` at the root `/v2/` endpoint matches your
expectations. If not, restart your `api` container.

If you're being served a legacy OSF page when you've enabled the flag for
the embosf'd page, or vice versa, restart your `web` container.

## Multiple application divs
If you encounter a situation where, when you scroll the screen, you see another copy of
your app, and you inspect to discover you have more than one application div, verify:
* You are using the correct name/casing for all of your components (PascalCase for 
angle-bracket invocation)

If you have this problem but it's not for one of the reasons listed above, please add it
to this list.

## Component test: Cannot read property 'generate' of undefined
This generally means you are trying to render a component with an `OsfLink` that uses the `@route`
parameter. You just need to

`import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';`

Then, either in `beforeEach` or in the particular problematic test:

`this.owner.register('service:router', OsfLinkRouterStub);`

## Buttons in modals aren't tracking analytics events
Check out the {{#link-to 'docs.analytics'}}analytics documentation{{/link-to}} scopes section
for the answer to this.