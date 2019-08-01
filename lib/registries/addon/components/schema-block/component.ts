import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

// import { FormBlock } from 'ember-osf-web/models/registration-schema';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SchemaBlock extends Component {

}
