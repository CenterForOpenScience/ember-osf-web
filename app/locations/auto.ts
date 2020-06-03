import AutoLocation from '@ember/routing/auto-location';
import cleanURL from 'ember-osf-web/utils/clean-url';

// Sadly the `auto` location must be overriden, otherwise
// ember-cli's server doesn't allow visiting specific URLs
export default class GuidAutoLocation extends AutoLocation {
    setURL(url: string) {
        return super.setURL(cleanURL(url));
    }

    replaceURL(url: string) {
        if (super.replaceURL) {
            return super.replaceURL(cleanURL(url));
        }
        return undefined;
    }

    formatURL(url: string): string {
        return super.formatURL(cleanURL(url));
    }
}
