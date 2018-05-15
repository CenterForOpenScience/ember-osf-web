import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import StatusMessages, { StatusMessage } from 'ember-osf-web/services/status-messages';
import styles from './styles';
import layout from './template';

@localClassNames('StatusBanner')
export default class StatusBanner extends Component {
    layout = layout;
    styles = styles;

    @service statusMessages!: StatusMessages;

    @alias('statusMessages.messages') messages!: StatusMessage[];
}
