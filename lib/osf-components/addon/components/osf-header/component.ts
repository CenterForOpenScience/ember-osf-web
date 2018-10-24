import Component from '@ember/component';
import config from 'ember-get-config';
import layout from './template';

export default class OSFHeader extends Component {
    layout = layout;
    secondaryNavbarId = config.secondaryNavbarId;
}
