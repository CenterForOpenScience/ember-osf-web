import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

import { layout } from 'ember-osf-web/decorators/component';

@tagName('')
@layout(hbs`{{yield}}`)
export default class OsfDialogTrigger extends Component {
}
