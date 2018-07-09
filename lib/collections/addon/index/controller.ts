import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';
import sanitizeHtml from 'sanitize-html';

export default class Index extends Controller {
    @service analytics!: Analytics;
    @service theme!: Theme;

    sanitizeOptions = {
        allowedTags: [
            ...sanitizeHtml.defaults.allowedTags,
            'h1',
            'h2',
        ],
        allowedClasses: {
            '*': '/^.*$/',
        },
    };
}
