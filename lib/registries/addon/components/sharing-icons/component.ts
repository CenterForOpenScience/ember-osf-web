import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Analytics from 'ember-osf-web/services/analytics';
import param from 'ember-osf-web/utils/param';
import styles from './styles';
import layout from './template';

export default class SharingIcons extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    title!: string;
    hyperlink!: string;
    description!: string;
    resultId!: string;
    parentId!: string;
    facebookAppId?: string;

    @computed('hyperlink', 'title')
    get twitterHref() {
        const queryParams = {
            url: this.hyperlink,
            text: this.title,
            via: 'OSFramework',
        };
        return `https://twitter.com/intent/tweet?${param(queryParams)}`;
    }

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
        return `https://www.facebook.com/dialog/share?${param(queryParams)}`;
    }

    // https://developer.linkedin.com/docs/share-on-linkedin
    @computed('hyperlink', 'description')
    get linkedinHref() {
        const url = encodeURIComponent(this.hyperlink || '').slice(0, 1024);
        // Linkedin uses the head meta tags regardless of the share url params
        return `https://www.linkedin.com/shareArticle?url=${url}`;
    }

    @computed('hyperlink', 'title')
    get emailHref() {
        const queryParams = {
            subject: this.title,
            body: this.hyperlink,
        };
        return `mailto:?${param(queryParams)}`;
    }
}
