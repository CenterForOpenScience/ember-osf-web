import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import layout from './template';

// Adapted from Ember-SHARE
export default class QuerySyntax extends Component {
    layout = layout;

    @service i18n!: I18N;
}
