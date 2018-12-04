import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
export default class OSFHeader extends Component {
    secondaryNavbarId = config.secondaryNavbarId;
}
