import Component from '@ember/component';
import { inject as service } from '@ember/service';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

// Adapted from Ember-SHARE
@layout(template, styles)
export default class QuerySyntax extends Component {
    @service i18n!: I18N;
}
