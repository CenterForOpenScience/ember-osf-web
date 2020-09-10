import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import template from './template';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

@layout(template)
@localClassNames('RecentList')
export default class RegistriesRecentList extends Component {
    @service analytics!: Analytics;
    recentRegistrations!: Registration[];

    @computed('recentRegistrations.[]')
    get registrations() {
        return this.recentRegistrations.map(({ id, title, contributors }) => ({
            id,
            title,
            url: `${osfUrl}${id}`,
            contributors: contributors
                .map(({ fullName }) => ({ name: fullName })),
        }));
    }
}
