import Controller from '@ember/controller';
import config from 'ember-get-config';

import param from 'ember-osf-web/utils/param';

const { OSF: { casUrl, orcidClientId, url } } = config;

export default class Register extends Controller {
    orcidUrl = `https://www.orcid.org/oauth/authorize?${param({
        client_id: orcidClientId || '',
        scope: '/authenticate',
        response_type: 'code',
        redirect_uri: `${casUrl}/login?client_name=OrcidClient#show_login`,
    })}`;

    institutionUrl = `${casUrl}/login?${param({
        campaign: 'institution',
        service: `${url}/login/?next=${encodeURI(url)}`,
    })}`;
}
