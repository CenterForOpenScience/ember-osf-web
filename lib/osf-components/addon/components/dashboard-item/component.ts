import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import moment from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class DashboardItem extends Component {
    @service i18n!: I18N;
    @service analytics!: Analytics;

    node?: Node;

    @alias('getAncestorTitles.lastComplete.value') ancestry!: string[];
    @alias('node.bibliographicContributors') contributors!: Contributor[];

    @computed('node.dateModified')
    get date(): string | undefined {
        return this.node ? moment(this.node.dateModified).format('YYYY-MM-DD h:mm A') : undefined;
    }
}
