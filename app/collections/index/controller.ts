import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import sanitizeHtml from 'sanitize-html';

import Analytics from 'ember-osf-web/services/analytics';
import Theme from 'ember-osf-web/services/theme';

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
