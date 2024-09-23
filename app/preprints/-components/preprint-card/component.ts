import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-osf-web/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import Preprint from 'ember-osf-web/models/preprint';
import pathJoin from 'ember-osf-web/utils/path-join';
import { Permission } from 'ember-osf-web/models/osf-model';

import template from './template';
import styles from './styles';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class PreprintCard extends Component {

    preprint?: Preprint;
    delete?: (preprint: Preprint) => void;
    showTags = false;
    readOnly = false;

    searchUrl = pathJoin(baseURL, 'search');

    get shouldShowUpdateButton() {
        return this.preprint && this.preprint.currentUserPermissions.includes(Permission.Admin);
    }

}
