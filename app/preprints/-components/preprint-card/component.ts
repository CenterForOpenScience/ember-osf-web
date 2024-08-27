import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';
import Store from '@ember-data/store';

import { layout } from 'ember-osf-web/decorators/component';
import Preprint from 'ember-osf-web/models/preprint';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';
import { Permission } from 'ember-osf-web/models/osf-model';
import Toast from 'ember-toastr/services/toast';

import RouterService from '@ember/routing/router-service';
import Intl from 'ember-intl/services/intl';
import template from './template';
import styles from './styles';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class PreprintCard extends Component {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;

    preprint?: Preprint;
    delete?: (preprint: Preprint) => void;
    showTags = false;
    readOnly = false;

    searchUrl = pathJoin(baseURL, 'search');

    get shouldShowUpdateButton() {
        return this.preprint && this.preprint.currentUserPermissions.includes(Permission.Admin);
    }

}
