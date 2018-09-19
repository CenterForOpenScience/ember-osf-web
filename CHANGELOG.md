# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Models:
    - `registration-schema` (including related adapter & serializer)
    - `token`
    - `scope`
- Components:
    - `draft-registration-card` - summary card for draft registrations
    - `node-list` - produce a paginated list of nodes from a relationship
    - `copyable-text` - display some read-only text with a button to copy it
    - `validated-input/checkboxes` - list of checkboxes to choose what belongs in a has-many relation
    - `paginated-list/all` - list of all models of a given type
    - `osf-header` - the OSF navbar, various banners, and secondary navbar wormhole all wrapped up.
    - `hyper-link` - combined `a` and `{{link-to}}` based off the `route` passed in. Supports analytics as well.
    - `delete-button` - configurable delete button, including a confirmation modal and scientist name
- Routes:
    - `guid-node/registrations` - registrations tab
    - `settings` - includes the settings side nav
    - `settings/tokens` - list of personal access tokens
    - `settings/tokens/edit`
    - `settings/tokens/create`
- Tests:
    - `guid-node/registrations` acceptance test
- Blueprints:
    - `osf-model` - creates model, adapter, and serializer for an OSF model
- Types:
    - `ember-cli-mirage` - the 70% that seems possible to express in typescript
- Engines:
    - `ember-osf-registries` - moved/upgraded into the registries engine

### Changed
- Models:
    - `osf-model` - add `relatedCounts` attribute and `loadRelatedCounts()` method
    - `registration` - add `archiving` attribute and `registrationSchema` relationship, typed `registeredMeta`
    - `draft-registration` - changed `registrationSchema` relationship type to be `registration-schema`
    - `node` - added attributes: `preprint: boolean`, `subjects: string[]`, and `currentUserCanComment: boolean`
    - `user` - made `middleNames` `string` (was `string[]`), added `suffix: string`, `active: boolean`, `social: {}`
- Adapters:
    - `draft-registration` - override `urlForCreateRecord()` to `POST` to `nodes/{guid}/draft_registrations`
- Serializers:
    - `osf-serializer`:
        - populate `relatedCounts` attribute from relationship meta
        - allow setting `serialize: true` for an attribute in `FooSerializer.attrs` to guarantee the attribute
          will always be serialized, even when not dirty
- Services:
    - `route-context` - added ability to pass query params to `setGuid()`/`loadModel()`
- Components:
    - `file-renderer` - remove initialWidth MFR parameter
    - `node-blurb` - renamed to `node-card`
    - `node-card` - add `registration` type, optional tags display, and placeholder when `node` is not set, made tagless
    - `node-navbar` - use `linkTo` for registrations
    - `paginated-relation` renamed to `paginated-list/has-many`
        - refactored to allow sharing functionality among different types of list
        - add ability to specify placeholders, and pass actions to items for reloading the list
        - `paginated-list/layout`, the shared layout component for the other `paginated-list/*`
        - `paginated-list/all`, for listing all models of a given type
    - `validated-input` - replaced `{{validated-input type='foo'}}` with `{{validated-input/foo}}`,
      since the interface varies by type
        - `validated-input/checkbox`
        - `validated-input/checkboxes` (new!)
        - `validated-input/date`
        - `validated-input/recaptcha`
        - `validated-input/text`
        - `validated-input/textarea`
    - `osf-navbar` - modified to yield a list home links for engines to override, if required
- Routes:
    - `guid-node` - request `forks`, `registrations`, and `draft_registrations` related counts when resolving guid
    - `guid-node/forks` - use placeholder for forks list
    - `guid-registration` - request `forks` related count when resolving guid
    - `guid-registration/forks` - use placeholder for forks list
    - `resolve-guid/resolved-guid-route` - pass-through query params to `routeContext.setGuid()`
- Engines:
    - `analytics-page` - use `node-list` component for linked nodes list
- Handbook:
    - Fix link styling, remove double underline
    - Update ember-cli-addon-docs dependency
    - Add info for dev-env, testing, visual style, and written style
- Misc:
    - install `@cos-forks/ember-content-placeholders`
    - upgrade to ember(-(cli|data))@~3.3.0
    - don't strip ember-test-selectors from production builds
- DX:
    - Have guid-like IDs for mirage factories (nodes and users to start)
    - Disabled `space-infix-ops` eslint rule for .d.ts
    - Disabled `no-await-in-loop` eslint rule for tests
    - Made mirage factories TypeScript and type check them against Ember models
    - TypeScripted mirage serializers
    - Refactored mirage `node` views relationship lists into single `relationshipList` function
    - Augmented mirage types
    - Exported `AttributesFor` from `ember-data` types
    - Defined `ember-data` `AttributesFor` and `RelationshipsFor` such that they only include `string` keys.
    - Improved osf-api types
    - Fixed up types for `faker.list.cycle`/`faker.list.random`
    - Disable `max-classes-per-file` tslint rule globally
    - Increase mirage support for:
        - Non-relationship links
        - Guid files
        - Root user

### Removed
- Models:
    - `metaschema` (including related adapter & serializer)
- Services:
    - `file-manager` (including skipped tests and one unused reference)

## [0.7.0] - 2018-08-07
### Added
- Models:
    - `region` - for storage i18n
- Components:
    - `cookie-banner` - notify logged-out users the site uses cookies
- Feature Flags:
    - `storage_i18n` - enable region selector on project creation
- Assets:
    - images for home page
    - images for dashboard
- Third-party Packages:
    - `qunit-dom` - Better test assertions (especially for hidden things)
    - `ember-test-selectors` - Find things in your dom without messing everything up
- Tests:
    - `dashboard` - more application tests
- Misc:
    - `keen` metrics adapter configured for anonymized IP addresses
    - CSRF support on all ajax requests
- DX:
    - `ember-cli-mirage` factories for users, nodes, contributors, and institutions
    - resources to the handbook

### Changed
- Models:
    - `node` - add `region` relationship
    - `user` - add `defaultRegion` relationship
- Components:
    - `maintenance-banner` - set cookie on dismiss and check cookie before showing
    - `osf-footer` - remove Google Plus logo/link
- Services:
    - `analytics` - support multiple metrics adapters
- Routes:
    - `guid-node` - add `join-osf-banner`
    - `home` - replace testimonial and use local assets
    - `dashboard` - use local assets
- DX:
  - enable sourcemap generation by default

## [0.6.1] - 2018-07-31
### Changed
- local storage key used for `ember-simple-auth`

## [0.6.0] - 2018-07-13
### Added
- Models:
    - `banner` - used to fetch `/_/banners/current/` from the API
- Components:
    - `scheduled-banner` - display the "current" banner on the landing page(s)

### Changed
- refactored feature flags to be loaded from API base (`/v2`)
- check route feature flags in `Router._doTransition` instead of `Router.willTransition`

### Removed
- Feature Flags:
    - `ember_support_page`
    - `ember_home_page`

## [0.5.2] - 2018-07-11
### Fixed
- Lazy engine title stealing

## [0.5.1] - 2018-07-10
### Added
- Missing analytics:
  - Institutions landing page (page and event tracking)
  - Dashboard filtering
  - User quick files page (more event tracking)
  - Quick files detail page (event tracking)
- Mirage/Tests:
  - Factories (and supporting code) for Mirage and the Dashboard
  - Dashboard application test

### Changed
- Components:
  - `simple-paginator` - use &gt; and &lt; instead of font-awesome chevrons
- Engines:
  - `analytics` - set page title to "OSF | [node title] Analytics"
- DX:
  - Test assertions: Collapse all whitespace characters to a single space

## [0.5.0] - 2018-06-29
### Added
- Routes:
  - `guid-node.analytics` - analytics tab for nodes
  - `guid-registration.analytics` - analytics tab for registrations
- Components:
  - `paginated-relation` - display a model's hasMany relationship as a paginated list
- Engines:
  - `analytics` - engine for analytics tabs
- DX:
  - Auto-deployment of handbook to GitHub pages on Travis `develop` branch builds

### Changed
- Routes:
  - `guid-node.forks` - use `paginated-relation` component
  - `guid-registration.forks` - use `paginated-relation` component
- DX:
  - `rootURL` is now configurable via `ROOT_URL` environment variable
  - production builds will respect `MIRAGE_ENABLED`
  - `ember-cli-addon-docs` in handbook will use `ASSETS_PREFIX` to find assets

### Fixed
- Components:
    - `node-navbar` - banner overlapping

## [0.4.1] - 2018-06-26
### Changed
- Anonymize IPs sent to Google Analytics

## [0.4.0] - 2018-06-26
### Added
- Routes:
  - `error-no-api` - display a friendly message when the API is not available
  - `guid-node.forks` - forks tab for nodes
  - `guid-registration.forks` - forks tab for registrations
  - `institutions` - institutions landing page
  - `resolve-guid.forks` - handling for guid sub-route: `forks`
- Components:
  - `delete-node-modal` - deletion of nodes with the name verification step
  - `node-blurb` - similar node previews all over the OSF
  - `simple-paginator` - you know, for pagination
- Utils:
  - `random-scientist` - to support the `delete-node modal` component
- Engines:
  - `collections`
    - Routes:
      - `application` - placeholder
      - `index` - placeholder
      - `provider` - placeholder
      - `provider.discover` - placeholder
      - `provider.submit` - placeholder
    - Components:
      - `test-component` - engine component example
- DX:
  - [ember-css-modules-stylelint](https://github.com/dfreeman/ember-css-modules-stylelint)
  - [ember-css-modules-reporter](https://github.com/dfreeman/ember-css-modules-reporter)
  - flag for enabling mirage in development mode
  - developer handbook as in-repo engine
  - custom component blueprint

### Changed
- Components:
  - `contributor-list` - modify to accept lists with links
  - `sign-up-form` - only show captcha when all other form fields are valid
  - `tos-consent-banner` - refactor to use ember-css-modules
- Models:
  - `node` - add `fork()` method
  - `user-registration` - add max length validation for `email1`
- Misc:
  - update OSF API version to 2.8
  - refactor/simplify auth logic
- DX:
  - make assets prefix configurable (defaults to `/ember_osf_web/`)
  - disable lint-on-build by default (enable with `LINT_ON_BUILD`)
  - disable sourcemap generation by default (enable with `SOURCEMAPS_ENABLED`)
  - convert remaining tests to TypeScript and modernize
  - disable `no-restricted-globals` for type declaration files
  - enforce consistent spacing before function parens
  - better code coverage reporting
  - `zoom-to-guid` is now `zoom-to-route`

### Fixed
- Models:
    - `user-registration` - correct max length validation of `fullName`

## [0.3.7] - 2018-06-08
### Changed
- Skip test for showing ToS consent banner (will be re-enabled in develop)

## [0.3.6] - 2018-06-07
### Fixed
- Unset acceptedTermsOfService when falsy to avoid premature validation of consent checkbox

## [0.3.5] - 2018-05-29
### Fixed
- Allow acceptedTermsOfService to be null to avoid premature validation of consent checkbox

## [0.3.4] - 2018-05-25
### Added
- GDPR ToS banner (for existing users)

## [0.3.3] - 2018-05-24
### Added
- GDPR ToS consent checkbox

## [0.3.2] - 2018-05-17
### Fixed
- Keep Getting Started video modal closed after its dismissed

## [0.3.1] - 2018-05-08
### Changed
- i18n locales are now enabled with `ENABLED_LOCALES` env variable

## [0.3.0] - 2018-05-03
### Added
- Node navbar: to accompany all node pages
- Status Banner: shows status messages
- Maintenance Banner: shows maintenance messages
- TypeScript: Add ember-cli-typescript and ember-cli-tslint
- CSS: Add `_typography.scss` with responsive font styling and `_accessibility.scss` for accessibility-related styling
- Addon: ember-a11y-testing
- Test: make sure all translations files contain all terms
- Use ember-decorators (first application: `institution-carousel` component)
- Added isPublic, authenticated, and resource dimensions to trackPage()
- defaultTo utility for initializing component arguments
- Loading indicator to file-renderer component
- Join OSF banner
- toArray utility
- meta-tags service
- Test: make sure config types match actual config

### Changed
- TypeScript: Rename files to .ts
- Modified several templates and css properties for increased accessibility
- Navbar to fit new styles in `osf-style`
- Refactor handling of `embeds` in `osf-serializer`
- Update dashboard "new project" task to send only one request
- Moved analytics tracking to a Service
- Use meta-tags service to add meta-tags to Quick File detail
- Combine footer and copyright; simplify both while making more accessible
- Ember builds will now fail on TypeScript errors.

### Removed
- Homegrown dirty relationship tracking, with automagic additional requests on save
- Contributor management methods on `user` model

## [0.2.0] - 2018-02-14
### Added
- Analytics tracking on all page transitions

### Changed
- Ignore `order/properties-alphabetical-order` rule in stylelint.
- Use latest ember-osf@develop (which includes Quick Files move-to-project)

### Fixed
- Inject jQuery properly in `file-share-button` dynamic iframe code

## [0.1.1] - 2018-02-08
### Changed
- In the `file-share-button` component:
  - Use encoded download URL for MFR URL
  - Build fileURL from config.OSF.url and guid instead of window.location
  - Build mfrUrl from config.OSF.renderUrl instead of hard-coded

## [0.1.0] - 2018-02-07
### Added
- Quick Files

[Unreleased]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.7.0...HEAD
[0.7.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.5.2...0.6.1
[0.5.2]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.5.1...0.5.2
[0.5.1]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.7...0.4.0
[0.3.7]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.6...0.3.7
[0.3.6]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.5...0.3.6
[0.3.5]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.4...0.3.5
[0.3.4]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.3...0.3.4
[0.3.3]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/CenterForOpenScience/ember-osf-web/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/CenterForOpenScience/ember-osf-web/compare/7dad0d13c0253de88720dd058e96e11905d56911...0.1.0
