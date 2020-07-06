import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { Permission } from 'ember-osf-web/models/osf-model';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ContributorsCardEditable extends Component {
    permissionOptions = [...Object.values(Permission)];
}
