import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SubmitSectionActive extends Component {
    title: string = this.title;
    didSave: boolean = this.didSave;
    panel: any = this.panel;
    description?: string = this.description;
}
