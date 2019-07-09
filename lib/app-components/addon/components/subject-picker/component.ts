import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Theme from 'ember-osf-web/services/theme';

import template from './template';

@layout(template)
export default class SubjectPicker extends Component {
    @service theme!: Theme;
}
