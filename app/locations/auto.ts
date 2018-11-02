import AutoLocation from '@ember/routing/auto-location';
import GuidLocationMixin from 'ember-osf-web/locations/guid-mixin';

// Sadly the `auto` location must be overriden, otherwise
// ember-cli's server doesn't allow visiting specific URLs
export default class GuidAutoLocation extends AutoLocation.extend(GuidLocationMixin) {
}
