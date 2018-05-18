import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Theme from 'collections/services/theme';
import sanitizeHtml from 'sanitize-html';

export default class Index extends Controller {
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
