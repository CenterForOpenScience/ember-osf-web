import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import StatusMessages, { StatusMessage } from 'ember-osf-web/services/status-messages';
import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('StatusBanner')
export default class StatusBanner extends Component {
    @service statusMessages!: StatusMessages;

    @alias('statusMessages.messages') messages!: StatusMessage[];
}
