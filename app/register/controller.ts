import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';

import Analytics from 'ember-osf-web/services/analytics';
import param from 'ember-osf-web/utils/param';

const { OSF: { casUrl, orcidClientId, url: baseUrl } } = config;

export default class Register extends Controller {
    queryParams = ['next'];
    next?: string;

    @service analytics!: Analytics;

    orcidUrl = `https://www.orcid.org/oauth/authorize?${param({
        client_id: orcidClientId || '',
        scope: '/authenticate',
        response_type: 'code',
        redirect_uri: `${casUrl}/login?client_name=OrcidClient`,
    })}`;

    @computed('next')
    get institutionUrl() {
        return `${casUrl}/login?${param({
            campaign: 'institution',
            service: `${baseUrl}/login/?next=${encodeURIComponent(this.next || baseUrl)}`,
        })}`;
    }
}
