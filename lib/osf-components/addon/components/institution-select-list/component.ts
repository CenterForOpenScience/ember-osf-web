import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class InstitutionSelectList extends Component {
    // optional properties
    analyticsScope: string = defaultTo(this.analyticsScope, '');
    usePlaceholders: boolean = defaultTo(this.usePlaceholders, false);

    // private properties
    @service analytics!: Analytics;
}
