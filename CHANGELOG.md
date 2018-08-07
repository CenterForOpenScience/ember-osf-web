# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
    - `qunit-dom` - Better test assetions (especially for hidden things)
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
- TypeScript: Add ember-cli-typscript and ember-cli-tslint
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
