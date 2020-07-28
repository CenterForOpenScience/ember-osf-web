# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [20.7.1] - 2020-07-22
### Changed
- keen public pageviews logging

## [20.7.0] - 2020-07-01
### Added
- user metrics CSV export on the institutional dashboard

## [20.6.1] - 2020-06-29
### Fixed
- broken UI due to `ember-responsive` ignoring our `app/breakpoints.ts`

## [20.6.0] - 2020-06-26
### Changed
- Upgrade to Ember 3.16
- Miscellaneous security and dependency upgrades

## [20.5.0] - 2020-06-03
### Changed
- Components
    - `institutions`
        - `dashboard/departments-panel`
        - `dashboard/institutional-users-list`
        - `dashboard/panel`
        - `dashboard/projects-panel`
- Mirage
    - Factories
        - `institution-user`
    - Serializers
        - `institution-user`

## [20.4.0] - 2020-05-26
### Changed
- link to institutions
- wording of OSFInstitutions
- config to use `isTruthy`
- draft-registration card component to remove progress-bar

### Added
- newline to "Read more" link
- logging API error messages
- CI template linting
- log API draft-registration submission error

### Fixed
- file links issue on overview page

## [20.3.1] - 2020-03-26
### Fixed
- `active` schemas filter parameter.

## [20.3.0] - 2020-03-23
### Added
- Ability to create/edit draft registration metadata to the Registries Submission workflow.
- Metadata to review page

## [20.2.1] - 2020-03-04
### Changed
- log registration submit errors to sentry

## [20.2.0] - 2020-02-27
### Changed
- Upgrade to Ember 3.15
- Miscellaneous bug fixes

## [20.1.0] - 2020-01-21
### Added
- Components
    - `registries/schema-block-renderer/read-only/multi-select`
    - `registries/registration-form-navigation-dropdown`
    - `registries/overview-form-renderer`

### Fixed
- Transforms
    - registration-responses
        - handle case where registration_responses is null
- Componenets
    - `registries/schema-block-renderer/read-only/mapper`
        - use `registries/schema-block-renderer/read-only/multi-select`
    - `registries/draft-registration-manager`
        - use set to set registration responses
    - `registries/schema-block-renderer/read-only/response`
        - preserve whitespace formatting in read-only response
    - `files/menu`
        - use responsive-dropdown without trigger div
        - prevent outside click from interrupting upload
    - `files/upload-zone`
        - do not show toast error for ongoing "canceled" uploads
    - `registries/schema-block-renderer/label/label-content`
        - add links to questions for review page
- Engines
    - `registries`
        - Components
            - `registries-metadata`
                - make contributors a link only for users with read access

### Changed
- Models
    - `registration`
        - apply `registration-responses` transform to `registrationResponses`
- Serializers
    - `registration`
        - normalize `registration_responses`
- Components
    - `registries/review-form-renderer`
        - invoke `Registries::RegistrationFormNavigationDropdown`
    - `registries/schema-block-renderer/label/label-content`
        - only render link to question when `@draftManager` is provided
    - `registries/schema-block-renderer/read-only/files`
        - only attempt to show validation when `@changeset` is provided
- Routes
    - `developer-apps`
        - Components
            - `client-secret`
                - PATCH to API when resetting client secret for developer app
- Engines
    - `registries`
        - Routes
            - `overview/index`
                - invoke `Registries::OverviewFormRenderer` instead of `RegistrationFormView`
- Tests
    - add percy snapshots for osf-navbar and registries-navbar
- DX
    - use Node 10 and pin with Volta
    - set EMBER_ENV=test when running tests

## [19.11.0] - 2019-12-16
### Added
- Components
    - `institutions`
        - `dashboard/departments-panel`
        - `dashboard/institutional-users-list`
        - `dashboard/panel`
        - `dashboard/projects-panel`
    - `Registries::DraftRegistrationManager`
    - `Registries::SchemaBlockRenderer::Editable::Files`
    - `Registries::SchemaBlockRenderer::ReadOnly::Files`
    - `OsfLayout::RegistriesSideNav`
    - `OsfLayout::RegistriesSideNav::Icon`
    - `OsfLayout::RegistriesSideNav::Label`
    - `OsfLayout::RegistriesSideNav::XLink`
    - `PageLink`
    - `Debouncer`
- Mirage
    - Factories
        - `institutional-user`
    - Serializers
        - `institutional-user`
- Routes
    - `institution`
        - added `dashboard` nested route
    - `guid-node`
        - added `drafts` nested route
    - `registries/drafts/draft`
        - added `metadata` nested route
- Engines
    - Components
        - `drafts/draft/-components/register`
    - Routes
        - `registries`
            - `drafts.draft`, `draft/<draftId>`
                - index route redirects to `draft/<draftId>/1`
            - `drafts.draft.page`, `draft/<draftId>/<page>`
- Utils
    - `page-param`
- Tests
    - Integration
        - `draft-registration-manager`
        - `page-link`
        - `registries-side-nav`
    - Unit
        - `page-param`
    - Acceptance
        - `draft form`
- Environment
    - Flags
        - added `guid-node.drafts` route flag
- Packages
    - `ember-element-helper` v0.2.0

### Changed
- Components
    - `paginated-list`
        - added `isTable` attribute to use a `table` over an `ul`
    - `sort-button`
        - changed local `selected` classes to nested global classes
    - `registries/schema-block-renderer/editable/**`
    - `validated-input`
        - Modified components to take in `onInput` callback.
            - added `withStatSummary` trait
    - `registries/partial-registration-modal`
        - added `onContinue` hook
    - `OsfLayout`
        - renamed `left-nav` to `left-nav-old`
        - created new `left-nav` that uses `registries-side-nav`
- Mirage
    - Factories
        - `institution`
            - added `withInstitutionalUsers` trait
    - Scenarios
        - `default`
            - added `SchemaBlock` node with files and contributors
- Models
    - `base-file-item`
        - added `createFolder`
    - `draft-registration`
        - added `registrationResponses`
    - `file`
        - added `toFileReference`
    - `file-provider`
        - use `rootFolder` instead of `files`
        - added links
    - `institution`
        - added `currentUserIsAdmin` boolean
        - added `statSummary` object
    - `institutional-user`
        - added `userGuid` string
    - `registration`
        - changed `draftRegistration` to be a relationship
        - added `registrationResponses`
        - added `includedNodeIds`
        - added `createDoi`
        - added `draftRegistrationId`
        - removed `registrationChoice`
        - removed `liftEmbargo`
    - `registration-schema`
        - added `schemaBlocks` inverse
    - `schema-blocks`
        - added `schema` relationship
        - added `elementId` computed
        - added `pageRouteParam` computed
- Routes
    - `institution`
        - moved to `index` folder
    - `registries.drafts.draft`
        - added navigation
    - `registries.overview`
        - updated to use `leftNavOld`
- Types
    - Renamed `PageResponse` to `RegistrationResponse`
- Tests
    - `schema-block-renderer`
        - added `files` block test

- Packages
    - Update `eslint-config-airbnb-base` to 14.0.0

### Removed
- Tests
    - unit, component tests using `FactoryGuy`
    - `FactoryGuy` factories
- Packages
    - `ember-data-factory-guy`
    - `ember-element-helper` (`fix-engines` branch)
- Types
    - `FactoryGuy` types

## [19.10.0] - 2019-10-02
### Added
- Models
    - `institutional-user`
- Helpers
    - `random-text`
        - generates random text
    - `unique-id`
        - generate a unique-enough string for use in a DOM element's `id`
    - `has-validation-error`
        - check if a list of validator results contains a validation error
- Components
    - `subjects/`
        - `browse`
        - `browse/animated-expand`
        - `browse/browse-manager`
        - `browse/item-list`
        - `browse/item`
        - `display`
        - `manager`
        - `manager/single`
        - `search`
        - `search/search-result`
        - `widget`
    - `editable-field/subject-field-manager`
    - `files/`
        - `browse`
        - `item`
        - `list`
        - `manager`
        - `selected-list`
        - `upload-zone`
        - `widget`
    - `registries/review-form-renderer`
    - `schema-block-renderer/`
        - `editable`
        - `read-only`
- Validators
    - `list` - apply a validator to a list
- Tests
    - Unit
        - helpers
            - `has-validation-error`
        - validators
            - `validateList`
    - Integration
        - `unique-id`
        - `random-text`
        - `Files::Widget`
- Ember Optional Features
    - `template-only-glimmer-components`
- Mirage
    - Factories
        - `subject`
        - `file-provider`
    - Serializers
        - `subject`
        - `file-provider`
    - Views
        - `provider-subjects`
        - `file`
- Types
    - `ember-animated`
- Packages
    - `ember-animated`
    - `ember-element-helper` (`fix-engines` branch)
- Handbook
    - `Subjects::Widget` component to gallery
    - `Files::Widget` component to gallery
    - `validateList` validator
    - `has-validation-error` helper

### Changed
- Models
    - `taxonomy`
        - renamed to `subject` and updated for new subjects-as-relationships architecture
    - `node`
        - changed `subjects` attribute into a hasMany relationship
    - `preprint`
        - changed `subjects` attribute into a hasMany relationship
        - removed `uniqueSubjects` computed property
    - `preprint-provider`
        - changed `hasHighlightedSubjects` alias to use `highlighted_subjects` related link meta
    - `provider`
        - renamed `taxonomies` hasMany relationship to `subjects`
        - renamed `highlightedTaxonomies` hasMany relationship to `highlightedSubjects`
    - `file`
        - rename `node` belongsTo relationship to `target`
- Serializers
    - `taxonomy`
        - renamed to `subject`
- Adapters
    - `taxonomy`
        - renamed to `subject`
- Components
    - `editable-field`
        - use `osf-dialog` instead of `bs-modal`
        - pass `@fixedWidth` through to `OsfDialog`
        - use `@manager.isSaving` to disable submit & cancel buttons
        - `category-manager`
            - expose `isSaving` as alias for `save.isRunning`
        - `description-manager`
            - expose `isSaving` as alias for `save.isRunning`
        - `institutions-manager`
            - expose `isSaving` as alias for `save.isRunning`
        - `license-manager`
            - expose `isSaving` as alias for `save.isRunning`
        - `publication-doi-manager`
            - expose `isSaving` as alias for `save.isRunning`
        - `tags-manager`
            - expose `isSaving` as alias for `save.isRunning`
    - `node-category-picker`
        - remove `@renderInPlace={{true}}` from `PowerSelect` invocation
    - `zoom-to-route`
        - remove `@renderInPlace={{true}}` from `PowerSelect` invocation
    - `registries/registries-license-picker`
        - remove `@renderInPlace={{true}}` from `PowerSelect` invocation
    - `registries/license-viewer`
        - use `osf-dialog` instead of `bs-modal`
    - `file-icon`
        - folders should always use folder icon
    - `sort-button`
        - suppress box-shadow when active
    - `osf-dialog`
        - darken background overlay
    - `registries/registries-metadata`
        - use `Subjects::Widget` and `Subjects::Display` (and related managers) for subjects editable field
    - `schema-block-group-renderer`
        - take in renderStrategy as mapper
        - take variable for `registrationResponses`
    - `schema-block-renderer`
        - broke components into `editable` and `read-only` structures
- Tests
    - renamed `taxonomy` to `subject` in `preprint-provider` FactoryGuy factory
    - Unit
        - `adapters/taxonomy-test` renamed to `adapters/subject-test`
        - `models/taxonomy-test` renamed to `models/subject-test`
        - `serializers/taxonomy-test` renamed to `serializers/subject-test`
        - `models/preprint-test`
            - removed test for `subject` attribute
    - Integration
        - `registries/schema-block-group-renderer` updated to include `renderStrategy`
- Mirage
    - Factories
        - `node`
            - removed `subjects` attribute
            - added `withFiles` trait
        - `registration`
            - added `widthSubjects` trait
        - `file`
            - added `target` association
            - addded `asFolder` trait
    - Serializers
        - `registration-provider`
            - added subjects related link
        - `registration`
            - added subjects self and related links
        - `file`
            - s/`node`/`target`/
            - added folder links
        - `node`
            - added files link
    - Views
        - `osf-resource`
            - added self link patch handling
    - Scenarios
        - `registration`
            - create some subjects
        - `handbook`
            - create a file tree for the handbook
- Types
    - `ember-changeset-validations`
        - added `ValidatorFunction` and `ValidatorResult`
- Config
    - updated to use API version 2.16
- Packages
    - upgrade to `ember-animated@0.8.1`

### Removed
- Tests
    - `taxonomy` FactoryGuy factory

### Fixed
- Components
    - `home/support-section/support-item`
        - s/this./@/ because this is template-only
        - added splattributes because this is template-only
    - `registries/registries-advisory-board`
        - fixed template lint
        - added splattributes because this is template-only
    - `meetings/index/meetings-footer`
        - added splattributes because this is template-only
    - `registries/registries-advisory-board`
        - added splattributes because this is template-only
    - `registries/sharing-icons/popover`
        - added splattributes because this is template-only
- Handbook
    - `osf-dialog` `demo-is-open` needs component file because it muts `isOpen`

## [19.9.0] - 2019-09-06
### Added
- Components
    - `schema-chunk` - yields different types of schema-chunk pieces
    - `hierarchical-list`
        - `hierarchical-list/item`
        - `hieararchical-list/item-manager`
    - `partial-registration-modal` which implements `hierarchical-list`
        - `partial-registration-modal/manager`
- Tests
    - Integration
        - `hierarchical-list`
        - `partial-registration-modal`

### Changed
- Components
    - `project-contributors`
        - added `onAddContributor` hook
    - `osf-dialog`
        - add `@fixedWidth` param to prevent shrinking to fit contents
- Engines
    - `collections`
        - Tests
            - added/improved test selectors to templates related to submit
            - added/improved test selectors to templates related to discover
            - improved submit acceptance tests to perform assertions in addition to taking snapshots
            - improved update acceptance tests to perform assertions in addition to taking snapshots
            - improved discover acceptance tests to perform assertions in addition to taking snapshots
- Tests
    - added `ember-basic-dropdown-wormhole` div to test index.html
- Mirage
    - `osfNestedResource`
        - added `onCreate` hook to perform additional operations after creating a child resource
    - `searchCollections`
        - added ability to filter by collection metadata
        - added ability to sort collected items by dateModified
    - `mirage/factories/node.ts`
        - modified the factory to set `root` to self by default
    - `mirage/views/utils/index.ts`
        - modified filter funtion to filter by model id
- Packages
    - update to [ember-angle-bracket-invocation-polyfill@^2.0.2](https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill/releases/tag/v2.0.2)

### Fixed
- Components
    - `osf-dialog`
        - fixed buggy behavior with `@isOpen` -- make it actually DDAU
        - fixed styles so it displays the same both in and out of the handbook
        - clean up global state on destroy
- Engines
    - `collections`
        - fixed template lint and use angle brackets in submission templates
        - fixed template lint and use angle brackets in discover templates
        - `submit`
            - reload bibliographicContributors when adding a contributor
- Mirage
    - `osfNestedResource`
        - added custom `post` handler to fix `create` action
    - `node/contributors` nested resource
        - conditionally create bibliographic contributors when creating contributors
    - Factories
        - `collected-metadatum`
            - allow manual setting of collection metadata
    - Serializers
        - `contributors` - serialize correct nested self link
- Serializers
    - `relatedCounts` were not populated for resources loaded via `store.pushPayload`,
      which includes all embeds and results from `OsfModel.queryHasMany`

### Removed
- Helpers
    - `range` - ember-composable-helpers already provides a `range` that is better

## [19.8.0] - 2019-08-15
### Added
- Components
    - `form-controls` - a form-input wrapper that takes a changeset
    - `read-only-contributors-list` - a read only list of a node's contributors with a link to contributors page for editing
- Models
    - `schema-block` - for registration-schemas
- Modifiers
    - `capture-element` - easily store an element from the template

### Changed
- Models
    - `collected-metadatum`
        - removed `subjects` validation
        - removed `subjects` attribute
        - removed `displaySubjects` computed
- Components
    - `project-contributors/list`
        - add ability to load more pages of contributors
        - add loading indicator
    - `osf-dialog`
        - add `@isOpen` param for programmatic control
        - add `@isModal` param (default `true`)
- Engines
    - `collections`
        - Components
            - `collections-submission` - removed subjects section
            - `discover-page` - removed subject/taxonomy search filter
            - `collection-search-result` - removed subjects display
        - Routes
            - `discover` - removed subject/taxonomy facet

### Removed
- Components
    - `subject-picker`
- Engines
    - `collections`
        - Components
            - `collection-subjects-list`
            - `discover-page/facets/taxonomy`
            - `discover-page/active-filters/taxonomy`
        - Helpers
            - `custom-taxonomy-filter`

## [19.7.1] - 2019-08-05
### Changed
- Services
    - `analytics` - allow passing through of `nonIteraction` flag to Google Analytics
- Modifiers
    - `trackScroll` - set `nonInteraction` flag when calling `analytics.trackFromElement()`
- Routes
    - `home` - remove version and shorten analytics scope

## [19.7.0] - 2019-07-31
### Added
- Components
    - `osf-dialog` - for dialog boxes and modal popup things
- Tests
    - Acceptance
        - collections
            - discover page test that just takes snapshots
            - submit test that just takes snapshot
            - edit test that just takes snapshots

### Changed
- Components
    - `osf-navbar` - use img tag with alt text for navbar OSF logo instead of background CSS image
- Services
    - `analytics` - added `isWithdrawn` custom dimension to `trackPage()`

### Removed
- Packages
    - `ember-test-selectors`

### Fixed
- Components
    - `sign-up-policy` - fixed links to terms of service and privacy policy

## [19.6.1] - 2019-07-12
### Fixed
- Config:
    - add waffle flag for `guid-user` route
- Components:
    - `home`
        - `testimonials` - link to `guid-user` instead of `resolve-guid`

## [19.6.0] - 2019-07-12
### Added
- Mirage:
    - Factories:
        - `collected-metadatum`
        - `collection-provider`
        - `taxonomy`
    - Serializers:
        - `collected-metadatum`
        - `collection-provider`
        - `taxonomy`
    - Fixtures:
        - `taxonomies`
    - Scenarios:
        - `collection`
    - Views:
        - `collection-provider-taxonomies`
        - `collection-search`
    - Endpoints:
        - `/providers/collections`
        - `/providers/collections/:parentID/licenses/`
        - `/collections/:parentID/collected_metadata/`
        - `/providers/collections/:parentID/taxonomies`
        - `/search/collections/`

### Changed
- Models:
    - `collected-metadatum` - changed `guid` relationship to be a `node` relationship
    - `collection-provider` - removed `collections` relatioship
    - `collection`
        - removed `provider` relationship inverse (`collections`)
        - added `collectedMetadata` relationship
- Routes:
    - `new-home`
        - renamed to `home` (replacing existing `home` route)
        - add scroll analytics and improve wording
- Engines:
    - `collections`
        - updated `collection-item-picker` component to use `collectedMetadata` relationship
        - updated `collections-submission` component to set the `guid` relationship to the node instead of the guid
- Tests:
    - Acceptance:
        - `new-home` - renamed to `logged-out-homepage` (replacing existing `logged-out-homepage` test)
- Mirage:
    - Factories:
        - `collection` - add choices fields
    - Serializers:
        - `collection` - add `provider` and `collectedMetadata` relationships
    - Views:
        - `osf-resource` - add pass through `process()` to `osfNestedResource` `show` action
    - Utils:
        - `filter` - add ability to filter by a list of ids.
- Misc:
    - add lang attribute to `html` element in `index.html`

## [19.5.1] - 2019-06-24
### Added
- Tests:
    - Integration:
        - `meetings`
            - `detail`
                - `meeting-detail-header` - add tests for location and dates
- Components:
    - `new-home`
        - `testimonials` - A section for the testimonials carousel
        - `integrations versions A/B` - A list of all supported integrations
    - `carousel`

### Changed
- Components:
    - `meetings`
        - `index`
            - `meetings-list` - sort by submission count (descending) by default
        - `detail`
            - `meeting-submissions-list` - removed download count sorting
- Tests:
    - Acceptance:
        - `new-home` - Added tests to support integrations section
    - Integration:
        - `meetings`
            - `detail`
                - `meeting-submissions-list` - removed checking of download count sorting
    - Acceptance:
        - `meetings`
            - `detail` - add submission with long title
            - `index` - add meeting with long name

### Fixed
- Models:
    - `meeting-submission` - renamed `created` to `dateCreated` to match API
- Components:
    - `meetings`
        - `detail`
            - `meeting-submissions-list`
                - renamed `created` to `dateCreated` to match API
                - applied `table-layout: fixed` to force truncating of long submission titles
            - `meeting-detail-header` - only attempt to display dates when defined
        - `index`
            - `meetings-list` - applied `table-layout: fixed` to force truncating of long meeting names
- Tests:
    - Integration:
        - `meetings`
            - `detail`
                - `meeting-submissions-list` - renamed `created` to `dateCreated` to match API
- Mirage:
    - `meeting-submission` factory - renamed `created` to `dateCreated` to match API

## [19.5.0] - 2019-06-07
### Added
- Models:
    - `meeting` - for OSF Meetings
    - `meeting-submission` - for OSF Meetings submissions
    - `external-identity` - for connected identities
- Adapters:
    - `meeting` - in private namespace
    - `meeting-submission` - in private namespace, with custom urlforQuery and buildUrl methods.
    - `external-identity` - for connected identities
- Serializers:
    - `meeting`
    - `meeting-submission`
    - `external-identity` - for connected identities
- Routes:
    - `meetings` - parent route for meetings
        - `meetings.index` - meetings landing page
        - `meetings.detail` - meeting detail page
- Components:
    - `get-started-button` - a button that takes you to the '/register' page.
    - `search-bar` - a search bar component that takes you to the search page.
    - `paginated-list/x-header` - a paginated list header closure component
    - `banners/view-only-link` - banner displayed when using a view-only link
    - `new-home`
        - `hero-banner` - a banner to be used on the logged-out homepage.
        - `support-section`
            - `support-item` - an item on the support-section component
            - `learn-more-button` - a button that goes to the cos.io learn more page
    - `meetings`
        - `index`
            - `meetings-hero-banner` - meetings landing page hero banner
            - `meetings-list` - meetings list for the meetings index page
            - `meetings-footer` - meetings landing page footer
        - `detail`
            - `meeting-detail-header` - meeting detail header
            - `meeting-submissions-list` - meeting submissions list
    - `settings`
        - `account`
            - `connected-identities` - connected identities component
- Helpers:
    - `is-feature-enabled` - helper that checks if a feature flag is enabled
- Utilities:
    - `leafVals` - get values of all leaves in an object tree
    - `clean-url`
        - `notFoundURL` - makes a URL suitable for a `not-found` route's `path` param
    - `map-keys`
        - `camelizeKeys`
        - `snakifyKeys`
        - `mapKeysAndValues`
    - `url-parts`
        - `splitUrl`
        - `joinUrl`
        - `addQueryParam` - adds a query param to a given URL
        - `addPathSegment` - adds a path segment to a given URL
- Tests:
    - Acceptance:
        - `new-home`
        - `meetings/index`
        - `meetings/detail`
        - `view-only-link`
        - `registries/overview/view-only-link`
    - Integration:
        - `get-started-button`
        - `search-bar`
        - `hero-banner`
        - `view-only-link`
        - `meetings`
            - `index`
                - `meetings-hero-banner`
                - `meetings-list`
                - `meetings-footer`
            - `detail`
                - `meeting-detail-header`
                - `meeting-submissions-list`
        - `settings`
            - `account`
                - `connected-identities`
    - Unit:
        - utils:
            - `leafVals`
            - `notFoundURL` (in `clean-url`)
            - `camelizeKeys` (in `map-keys`)
            - `addPathSegment` (in `url-parts`)
- Mirage:
    - `meeting` factory
    - `meeting-submission` factory
    - private `meetings` endpoint
    - meetings scenario
    - `external-identities` factory and endpoint
    - add `external-identities` to settings scenario
- View-only link support:
    - Add `view_only` query param to `application` route
    - Store VOL info (token, anonymized) on `current-user` service
    - Include VOL token in all API requests, all links within OSF
- Types:
    - `ember-a11y-testing` - `a11yAudit`
- DX:
    - .vscode/settings.json
        - Add `typescript.tsdk` setting so that VS Code uses workspace's TypeScript version by default.

### Changed
- Adapters:
    - `osf-adapter` - added support for view-only links
- Controllers:
    - `applicaton` - added `viewOnlyToken` query param
- Routes:
    - `applicaton` - added `viewOnlyToken` query param
- Components:
    - `osf-navbar`
        - detect active OSF service for any non-engine service
        - `x-links/hyper-link/x-anchor` added support for view-only links
    - `paginated-list`
        - add ability to provide a header row
        - add splattributes to item
    - `contributor-list` - display something useful when using an anonymized VOL
    - `osf-link` - added support for view-only links
    - `osf-mode-footer` - add features tab for toggling feature flags
    - `app-components`
        - `license-text` - moved to `osf-components`
        - `license-picker` - moved to `osf-components`
- Authenticators:
    - `osf-cookie`
        - initialize any disabled feature flags found in config
        - added support for view-only links
- Decorators:
    - `checkAuth` - added support for view-only links
- Transforms:
    - `node-license` - use `camelizeKeys` and `snakifyKeys` utils
- Services:
    - `current-user` - added support for view-only links
- Utilities:
    - `sparse-fieldsets` - use `camelizeKeys` and `snakifyKeys` utils
- Tests:
    - Integration:
        - `contributor-list` - add tests for anonymized nodes
- Mirage:
    - `node` factory - added support for view-only links
    - `root` factory - added support for view-only links
    - default scenario - added meetings scenario
- Misc:
    - ugrade dependencies (see package.json diff)

## [19.4.0] - 2019-04-25
### Added
- Features:
    - Registries overview navigation menu (#600)
    - Editable registration institutions (#617)
    - Display registration wiki count (#625)
    - Add `citation_doi` to `<meta>` tags (#628)
- Components:
    - `citation-viewer` - displays citations for a node (#608)
- Data:
    - `Node.bibliographicContributors` relationship (#604)
    - `OsfModel.sparseHasMany`, `sparseLoadAll` (#614)
- Utils:
    - Sparse fieldset utils (#614)

### Changed
- Components:
    - `contributor-list` - display only bibliographic contributors (#604)

### Fixed
- Registries discover page - recognize links to registrations on test.osf.io (#597)
- Registration form rendering errors (#620)
- Allow withdrawing registrations without justification (#622)
- Position tooltips and footer correctly (#624, #626)

## [19.3.0] - 2019-04-18
### Added
- Addons:
    - `ember-changesets`
- Components:
    - `institutions-widget` - has a list of institutions associated with a node. Has a modal to add/remove
    - `institutions-list` - shows a list of institutions
    - `institution-select-list` - a checkbox list of institutions a user can select
    - `placeholder`
        - `circle` - a placeholder for circlular elements
- Routes:
    - `new-home` - new logged out home page route
    - `settings/account/change-password` - Panel for changing a user's password
    - `password-strength-bar` - Shows the strength of a given password
    - `support` - updated language and links

### Changed
- Components
    - `validated-model-form` - use changesets automatically

### Removed
- Components
    - `settings/account/request-export`

### Fixed
- `osf-navbar/auth-dropdown` - make sure `campaign` and `next` query params are included in link to register

## [19.2.0] - 2019-03-04
### Added
- Components:
    - `ancestry-display` - display node ancestry breadcrumbs
    - `settings/account/default-region` - Panel for setting a user's default region
    - `settings.account.-components.request-deactivation`
    - `settings.account.-components.request-export`
    - `settings/account/-components/connected-emails` - a list of all emails connected to an account
- Utils:
    - `getHref` - get an href from a `Link`
    - `getRelatedHref` - get an href from a `Relationship`
    - `tuple` - create a strictly-typed [tuple](https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple)
- Tests:
    - Acceptance:
        - `settings/account/connected-emails`
    - Integration:
        - `ancestry-display` component

### Changed
- Models:
    - `osf-model` - use proper types for `links` and `relationshipLinks` attributes
    - `file` - extend `links` types to include links specific to files
    - `user` - extend `links` types to include links specific to users
    - `developer-app` - extend `links` types to include links specific to developer apps
    - `collection` - improve types for choices fields
    - `collected-metadatum` - improve types for choice fields
    - `user-setting` - Added `requestExport()` function, `deactivationRequested` field, and `export` link
    - `osf-model`
        - use proper types for `links` and `relationshipLinks` attributes
        - added helper methods for creating and deleting M2M relationships:
            - `createM2MRelationship`
            - `deleteM2MRelationship`
- Mirage:
    - Slim down default scenario
    - Allow different set of scenarios to run based on local settings with `MIRAGE_SCENARIOS`
    - types:
        - `server.create(modelName, ...)` now looks up the `modelName` in the `ModelRegistry` and properly types the
          return values as `ModelInstance<ModelFromTheRegistry>` and type checks any model properties passed in.
        - same as above, but for `server.createList`
        - traits now take a type argument (the model they are a trait for) which results in proper typing for
          `afterCreate(model, server)` without requiring manual typing of its args.
        - the `afterCreate` method of mirage factories is typed similarly to trait's `afterCreate`
        - `normalizedRequestAttrs()` now requires the model name to be passed to ensure type safety
- Services
    - `analytics` - allow toast-on-click to be used in production builds (when enabled in dev banner)
- Components
    - `osf-link` - used to be `link`
        - `@onClick` parameter used to be `@onclick`
    - `<ContributorList>` - modified to take in different parameters
        - `node` (required)
        - `shouldTruncate` (default true)
        - `shouldLinkUsers` (default false)
    - `osf-mode-footer` - show dev banner based on `config.showDevBanner`
- Tests
    - Using new `click` handler everywhere in main app to verify `data-analytics-name` usage
- Travis
    - Use a production build for handbook
- OSF API
    - Bump version from 2.8 to 2.14
- Linting
    - upgraded to latest versions of:
        - eslint-plugin-typescript -> @typescript-eslint/eslint-plugin
        - typescript-eslint-parser -> @typescript-eslint/eslint-parser (now a dep of @typescript-eslint/eslint-plugin)
        - ember-cli-eslint (upgrade required to get eslint 5, for compatibility with @typescript-eslint/eslint-plugin)
        - eslint-plugin-ember (upgrade required for compatibility with ember-cli-eslint)
        - eslint-config-airbnb-base (upgrade required for compatibility with eslint 5)
        - eslint-plugin-eslint-comments (upgrade required for compatibility with eslint 5)
    - made style and config changes so that linting passes after above upgrades

### Removed
- Components:
    - `global-link-to`
    - `<ContributorList>` - modified to take in different parameters
        - `node` (required)
        - `shouldTruncate` (default true)
        - `shouldLinkUsers` (default false)
- Mirage:
    - `DEFAULT_LOGGED_OUT` setting is now redundant

## [19.1.2] - 2019-02-12
### Fixed
- Utils:
    - `transitionTargetURL` - clean guid routing path components from URLs
### Added:
- Route Flags:
    - `guid-node.index` -> `ember_project_detail_page`
    - `guid-registration.index` -> `ember_old_registration_detail_page`

## [19.1.1] - 2019-02-11
### Fixed
- Router:
    - check route flags on URL transitions (except for initial transition)

## [19.1.0] - 2019-01-23
### Added
- Addons:
    - `loaders-css` - For animated loading indicators
- Components:
    - `settings.account.-components.security` - Two-factor authentication panel.
    - `osf-button` - our new, use-everywhere button component
- Models:
    - `user-setting`
- Routes:
    - `settings.account`
- Styles:
    - All styles from `osf-style`
- Validators:
    - `httpUrl` - validates that a string looks like an http url

### Changed
- Addons:
    - `ember-cli-mirage@0.4.10`
    - `ember-qunit@3.4.4`
    - `ember-cli-qunit@4.4.0`
    - `ember-cli-sass@8.0.1`
- Components:
    - `contributor-list` - takes an optional parameter `truncated`
- Models:
    - `developer-app` - use custom `httpUrl` validator for urls
- Templates:
    - `no-implicit-this` template rule activated
- Types:
    - upgrade to ember and ember-data 3.x types

### Removed
- Addons:
    - `osf-style`

## [19.0.2] - 2019-01-08
### Changed
- Routes
    - `goodbye` - add page tracking
    - `guid-node.forks` - accurately report resource privacy and type when page tracking
    - `guid-node.registrations` - accurately report resource privacy and type when page tracking
    - `guid-registration.forks` - add page tracking
    - `guid-user.quickfiles` - add resource type to page tracking
    - `settings.tokens.create` - add page tracking
    - `settings.tokens.edit` - - add page tracking
    - `settings.tokens.index` - add page tracking
- Engines:
    - `analytics-page` - accurately report resource privacy and type when page tracking

## [19.0.1] - 2019-01-04
### Fixed
- Routes:
    - `resolve-guid` - remove guid regex test because we have old guids that violate it

## [19.0.0] - 2019-01-03
### Added
- Addons:
    - `ember-onbeforeunload` - Handle warnings if we have unsaved changes on a page
- Components:
    - `new-project-navigation-modal` - For navigating away to nodes. Or not.
- Handbook:
    - `new-project-modal` component
    - `new-project-navigation-modal` component
- Models:
    - `user-email`
- Routes:
    - `settings.profile` - redirects to `settings.profile.name`
    - `settings.profile.education`
    - `settings.profile.employment`
    - `settings.profile.name` - Adds ability to change your name and name parts (with citation preview)
    - `settings.profile.social`
- Tests:
    - Integration:
        - `settings.profile.name.-components.citation-preview`
        - `new-project-navigation-modal` - component integration test
    - Acceptance:
        - `settings.profile.name`
        - `guid-user/quickfiles` - acceptance tests around landing on the page and mostly move to project
        - Add percy everywhere in the main app
    - Helpers:
        - `require-auth` - Mocks currentUser service to verify that routes that require auth redirect if unauthenticated    
- Types:
    - `ember-power-select/test-support` - types for useful functions
- Travis
    - Remove Firefox Testing

### Changed
- Addons:
    - `ember-code-snippet@2.3.1`
- Components:
    - `node-navbar` - Choose links to display with the same logic as legacy
    - `validated-model-form` - Add an optional hook for onWillDestroy
    - `sign-up-form` - accept `campaign` as an optional argument and set on user-registration model
- Handbook:
    - `validated-model-form` - Show how onWillDestroy works and use ember-onbeforeunload
- Models:
    - `node`
        - added `wikiEnabled` boolean attribute
        - added `userHasReadPermission` computed property
        - renamed `currentUserCanEdit` computed property to `userHasWritePermission`
        - renamed `currentUserIsAdmin` computed property to `userHasAdminPermission`
    - `user`
        - added validations for name fields
    - `provider` - made partial assets acceptable
    - `preprint-provider` - added `documentType` computed property for preprint word lookup
    - `user-registration` - added `campaign` property
- Routes:
    - `settings` - redirects to `settings.profile.name`
    - `register` - add branding for registries and preprint providers
- Tests:
    - improved integration tests for `node-navbar` component
    - Acceptance:
        - `register` - acceptance tests for the sign up page
- Adapters:
    - Added `parentRelationship` property to `osf-adapter`. Allows creating records at nested endpoints.
- Routes:
    - Add email verification modal to application template
- Misc:
    - Upgraded to `osf-style` 1.8.0

## [18.2.2] - 2018-12-18
### Added:
- Flags:
    - `enable_inactive_schemas`

### Changed:
- Components:
    - regisitries:
        - `registries-registration-type-facet` - only add ERPC schema when `enable_inactive_schemas` flag is off

## [18.2.1] - 2018-12-18
### Added
- Mirage:
    - `queryParamIsTruthy` util

### Changed
- Routes:
    - `guid-node.registrations` - add `?filter[active]=true` when fetching registration schemas
- Mirage:
    - use `queryParamIsTruthy` helper for boolean comparison

## [18.2.0] - 2018-11-29
### Changed
- Components:
    - `sign-up-form` - Distinguish between alrteady registered and invalid (e.g. blacklisted) emails
- Models:
    - `user-registration` - added invalid email validation and `addInvalidEmail` method
- Routes:
    - `register` - let CAS redirect to ORCID

## [18.1.2] - 2018-11-05
- Engines:
    - `registries/discover` - reset to first page on user search input

## [18.1.1] - 2018-11-05
- Routes:
    - `guid-node/registrations` - fix sorting of registration schema on new registration modal
- Engines:
    - `registries` - page resetting and scrolling fixes

### Changed
- Components:
    - `file-browser` - replaced project navigation modal with `new-project-navigation-modal` component
    - `new-project-modal` - Made it smarter and more reusable
    - `project-selector` - replaced project creation modal with `new-project-modal` component
- Pages:
    - `dashboard` - replaced project creation modal with `new-project-modal` component
- Tests:
    - `dashboard` - acceptance tests related to project creation workflow

## [18.1.0] - 2018-10-30
### Added
- Components:
    - `panel` - a general-use abstraction of bootstrap panels
    - `validated-model-form` - wraps common logic for forms made with `validated-input/*`
- Tests:
    - `panel` component integration test
- Handbook:
    - `panel` component
- Mirage:
    - `node` POST view to add currentUser as contributor
    - `regions` fixtures
    - `wb` view to move files from user or node to a node
- Routes:
    - `settings.applications` - list of developer apps
    - `settings.applications.edit`
    - `settings.applications.create`
- Decorators:
    - `@layout(template, styles)` in `ember-osf-web/decorators/component`

### Changed
- Components:
    - `loading-indicator` - added inline option
- Utilities:
    - `fix-special-chars` - made case-insensitive
- Tests:
    - `loading-indicator` - added tests for inline
- Handbook:
    - `loading-indicator` - added examples for inline
- Mirage:
    - `root` factory now adds all feature flags, not just route flags
    - `user` factory has 'withFiles' trait so non-current users can have files easily
    - `user` serializer has default_region relationship (hardcoded to us)
- Decorators:
    - `@requiredAction` moved to `ember-osf-web/decorators/component`
- Blueprints:
    - `component` - use `@layout`, don't add `styles.scss` or `@localClassNames`

### Removed
- Flags:
    - `ember_project_forks_page` - `guid-node.forks` and `guid-registration.forks` now always on
    - `ember_project_analytics_page` - `guid-node.analytics` and `guid-registration.analytics` now always on

## [18.0.0] - 2018-10-24
### Added
- Models:
    - `registration-schema` (including related adapter & serializer)
    - `token`
    - `scope`
    - `developer-app`
- Components:
    - `search-help-modal` - you know, the search help modal but as it's own component
    - `draft-registration-card` - summary card for draft registrations
    - `node-list` - produce a paginated list of nodes from a relationship
    - `copyable-text` - display some read-only text with a button to copy it
    - `validated-input/checkboxes` - list of checkboxes to choose what belongs in a has-many relation
    - `paginated-list/all` - list of all models of a given type
    - `osf-header` - the OSF navbar, various banners, and secondary navbar wormhole all wrapped up.
    - `hyper-link` - combined `a` and `{{link-to}}` based off the `route` passed in. Supports analytics as well.
    - `delete-button` - configurable delete button, including a confirmation modal and scientist name
    - `tags-widget` - you know, for tags
- Routes:
    - `guid-node.registrations` - registrations tab
    - `settings` - includes the settings side nav
    - `settings/tokens` - list of personal access tokens
    - `settings/tokens/edit`
    - `settings/tokens/create`
    - `register` - sign up page
- Transforms:
    - `fixstringarray` - similar to `fixstring` transform (unencodes special characters), but for string arrays
- Utils:
    - `param` - drop-in replacement for jQuery.param
- Helpers:
    - `math` - A helper to render TeX statements using KaTeX
- Engines:
    - `ember-osf-registries` - moved/upgraded into the registries engine
    - `collections` - Add collections engine
- Tests:
    - `guid-node/registrations` acceptance test
    - `tags-widget` component integration test
    - `register` route acceptance test
    - `param` util unit test
- Blueprints:
    - `osf-model` - creates model, adapter, and serializer for an OSF model
- Types:
    - `ember-cli-mirage` - the 70% that seems possible to express in typescript
- Handbook:
    - `tags-widget` - added to the handbook

### Changed
- Models:
    - `osf-model` - add `relatedCounts` attribute and `loadRelatedCounts()` method
    - `registration` - add `archiving` attribute and `registrationSchema` relationship, typed `registeredMeta`
    - `draft-registration`
        - change `registrationSchema` relationship type to be `registration-schema`
        - define inverse for `node` relationship as `draftRegistrations` instead of `null` (required by ember-data 3.4)
    - `node`
        - added attributes: `preprint: boolean`, `subjects: string[]`, and `currentUserCanComment: boolean`
        - use `fixstringarray` transform for `tags` attribute
    - `user` - made `middleNames` `string` (was `string[]`), added `suffix: string`, `active: boolean`, `social: {}`
    - `file` - use `fixstringarray` transform for `tags` attribute
    - `preprint` - define inverse for `node` relationship as `preprints` instead of `null` (required by ember-data 3.4)
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
    - `node-card`
        - add `registration` type
        - add optional tags display
        - use placeholder when `node` is not set
        - made tagless
        - use `tags-widget` component instead of `ember-tag-input` directly
        - `encodeURIComponent(tag)` when constructing tags search url
        - add `readOnly` argument to force-hide the dropdown controls
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
        - `validated-input/recaptcha` - added ability to bind action to reset recaptcha
        - `validated-input/text`
        - `validated-input/textarea`
    - `osf-navbar` - modified to yield a list home links for engines to override, if required
    - `sign-up-form` - added submit task & user-registration model creation
    - `osf-navbar/auth-dropdown` - make Sign Up button transition to register route, if enabled
- Routes:
    - `guid-node` - request `forks`, `registrations`, and `draft_registrations` related counts when resolving guid
    - `guid-node/forks` - use placeholder for forks list
    - `guid-registration` - request `forks` related count when resolving guid
    - `guid-registration/forks` - use placeholder for forks list
    - `resolve-guid/resolved-guid-route` - pass-through query params to `routeContext.setGuid()`
    - `guid-file` - use `tags-widget` component instead of `ember-tag-input` directly
    - `home` - remove submit task & user-registration model creation (moved to `sign-up-form` component)
- Engines:
    - `analytics-page` - set `readOnly=true` for node-cards in "links to this project" modal
- Tests:
    - Removed captcha visibility assertions from logged-out home page test
- Handbook:
    - Fix link styling, remove double underline
    - Update ember-cli-addon-docs dependency
    - Add info for dev-env, testing, visual style, and written style
- Misc:
    - install `@cos-forks/ember-content-placeholders`
    - upgrade to ember(-(cli|data))@~3.4.0
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
    - Mirage: pass through all requests on current domain
    - Fix up template-lint rules for `ember-cli-template-lint` 1.0
        - Configure the `attribute-indentation` rule to use 4 spaces and prevent lines > 120 chars
        - Enable `no-bare-strings` in place of the deprecated `bare-strings` rule
        - Disable `no-nested-interactive` which has replaced `nested-interactive` in the recommended ruleset

### Removed
- Models:
    - `metaschema` (including related adapter & serializer)
- Services:
    - `file-manager` (including skipped tests and one unused reference)
- Components:
    - `search-dropdown` (Unused)

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

[Unreleased]: https://github.com/CenterForOpenScience/ember-osf-web/compare/20.7.1...develop
[20.7.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.7.1
[20.7.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.7.0
[20.6.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.6.1
[20.6.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.6.0
[20.5.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.5.0
[20.4.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.4.0
[20.3.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.3.1
[20.3.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.3.0
[20.2.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.2.1
[20.2.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.2.0
[20.1.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/20.1.0
[19.11.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.11.0
[19.10.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.10.0
[19.9.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.9.0
[19.8.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.8.0
[19.7.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.7.1
[19.7.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.7.0
[19.6.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.6.1
[19.6.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.6.0
[19.5.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.5.1
[19.5.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.5.0
[19.4.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.4.0
[19.3.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.3.0
[19.2.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.2.0
[19.1.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.1.2
[19.1.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.1.1
[19.1.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.1.0
[19.0.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.0.2
[19.0.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.0.1
[19.0.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/19.0.0
[18.2.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.2.2
[18.2.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.2.1
[18.2.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.2.0
[18.1.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.1.2
[18.1.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.1.1
[18.1.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.1.0
[18.0.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/18.0.0
[0.7.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.7.0
[0.6.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.6.1
[0.6.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.6.1
[0.5.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.5.2
[0.5.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.5.1
[0.5.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.5.0
[0.4.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.4.1
[0.4.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.4.0
[0.3.7]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.7
[0.3.6]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.6
[0.3.5]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.5
[0.3.4]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.4
[0.3.3]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.3
[0.3.2]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.2
[0.3.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.1
[0.3.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.3.0
[0.2.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.2.0
[0.1.1]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.1.1
[0.1.0]: https://github.com/CenterForOpenScience/ember-osf-web/releases/tag/0.1.0
