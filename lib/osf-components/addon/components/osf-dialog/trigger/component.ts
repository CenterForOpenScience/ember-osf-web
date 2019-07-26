import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

import { layout } from 'ember-osf-web/decorators/component';

@tagName('')
@layout(hbs`{{yield}}`)
export default class OsfDialogTrigger extends Component {
}
