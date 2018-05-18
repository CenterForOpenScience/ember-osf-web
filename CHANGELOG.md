# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- guid-node.forks route
- node-blurb component, for the similar node previews all over the osf
- delete-node-modal component, for the deletion of nodes with the name verification step
- fork method to node model
- random-scientist util to support the delete-node modal
- simple-paginator component
- custom component blueprint

### Changed
- contributor-list component, to accept lists with links

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
