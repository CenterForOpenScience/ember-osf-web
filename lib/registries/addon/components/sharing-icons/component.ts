import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import $ from 'jquery';
// import trunc from 'npm:unicode-byte-truncate';
import layout from './template';

export default class SharingIcons extends Component {
    layout = layout;

    @service analytics!: Analytics;

    title!: string;
    hyperlink!: string;
    description!: string;
    resultId!: string;
    facebookAppId?: string;

    @computed('hyperlink', 'title')
    get twitterHref() {
        const queryParams = {
            url: this.hyperlink,
            text: this.title,
            via: 'OSFramework',
        };
        return `https://twitter.com/intent/tweet?${$.param(queryParams)}`;
    }

    /* TODO: Update this with new Facebook Share Dialog, but an App ID is required
     * https://developers.facebook.com/docs/sharing/reference/share-dialog
     */
    @computed('hyperlink', 'facebookAppId')
    get facebookHref() {
        if (!this.facebookAppId) {
            return null;
        }
        const queryParams = {
            app_id: this.facebookAppId,
            display: 'popup',
            href: this.hyperlink,
            redirect_uri: this.hyperlink,
        };
        return `https://www.facebook.com/dialog/share?${$.param(queryParams)}`;
    }

    // https://developer.linkedin.com/docs/share-on-linkedin
    @computed('hyperlink', 'description')
    get linkedinHref() {
        const url = encodeURIComponent(this.hyperlink || '').slice(0, 1024);
        const queryParams = {
            mini: 'true', // required, maxLength: 4
            // title: trunc(this.title || '', 200), // optional
            // summary: trunc(this.description || '', 256), // optional
            source: 'OSF', // optional, maxLength: 200
        };
        return `https://www.linkedin.com/shareArticle?url=${url}&${$.param(queryParams)}`;
    }

    @computed('hyperlink', 'title')
    get emailHref() {
        const queryParams = {
            subject: this.title,
            body: this.hyperlink,
        };
        return `mailto:?${$.param(queryParams)}`;
    }

    @action
    shareLink(href: string, category: string, label: string, extraInfo?: string | object) {
        // TODO submit PR to ember-metrics for a trackSocial function
        // for Google Analytics. For now, we'll use trackEvent.
        this.analytics.click(
            category,
            label,
            extraInfo,
        );
        if (label.includes('email')) {
            return;
        }
        window.open(href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=600,height=400');
        return true;
    }
}
