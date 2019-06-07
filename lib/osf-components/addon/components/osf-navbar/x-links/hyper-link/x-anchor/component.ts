import { attribute, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import CurrentUser from 'ember-osf-web/services/current-user';
import { addQueryParam } from 'ember-osf-web/utils/url-parts';
import template from './template';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

@layout(template)
@tagName('a')
export default class XAnchor extends Component {
    static positionalParams = ['href'];

    href?: string;

    @service currentUser!: CurrentUser;

    @attribute('href')
    @computed('href')
    get _href() {
        const { href } = this;
        const { viewOnlyToken } = this.currentUser;

        if (href && viewOnlyToken && (href.startsWith('/') || href.startsWith(osfUrl))) {
            return addQueryParam(href, 'view_only', viewOnlyToken);
        }
        return href;
    }
}
