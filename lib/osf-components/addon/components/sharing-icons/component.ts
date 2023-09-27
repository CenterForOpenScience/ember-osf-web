import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'ember-osf-web/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import param from 'ember-osf-web/utils/param';

import template from './template';

@layout(template)
export default class SharingIcons extends Component {
    // optional arguments
    title!: string;
    hyperlink!: string;
    description?: string;
    resultId?: string;
    parentId?: string;
    facebookAppId? = config.FB_APP_ID || '';

    @computed('hyperlink', 'title')
    get twitterHref(): string {
        const queryParams = {
            url: this.hyperlink,
            text: this.title,
            via: config.social.twitter.viaHandle,
        };
        return `https://twitter.com/intent/tweet?${param(queryParams)}`;
    }

    @computed('hyperlink', 'facebookAppId')
    get facebookHref(): string | null {
        if (!this.facebookAppId) {
            return null;
        }
        const queryParams = {
            app_id: this.facebookAppId,
            display: 'popup',
            href: this.hyperlink,
            redirect_uri: this.hyperlink,
        };
        return `https://www.facebook.com/dialog/share?${param(queryParams)}`;
    }

    @computed('hyperlink', 'title')
    get emailHref(): string {
        const queryParams = {
            subject: this.title,
            body: this.hyperlink,
        };
        return `mailto:?${param(queryParams)}`;
    }
}
