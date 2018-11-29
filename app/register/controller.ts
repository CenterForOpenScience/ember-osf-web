import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';

import Analytics from 'ember-osf-web/services/analytics';
import param from 'ember-osf-web/utils/param';

const { OSF: { casUrl, url: baseUrl } } = config;

export default class Register extends Controller {
    queryParams = ['next'];
    next?: string;

    @service analytics!: Analytics;

    @computed('next')
    get orcidUrl() {
        return `${casUrl}/login?${param({
            redirectOrcid: 'true',
            service: `${baseUrl}/login/?next=${encodeURIComponent(this.next || baseUrl)}`,
        })}`;
    }

    @computed('next')
    get institutionUrl() {
        return `${casUrl}/login?${param({
            campaign: 'institution',
            service: `${baseUrl}/login/?next=${encodeURIComponent(this.next || baseUrl)}`,
        })}`;
    }
}
