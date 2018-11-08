import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { GutterMode } from 'registries/components/gutters/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RegistriesMetadata extends Component {
    gutterMode!: GutterMode;

    @computed('gutterMode')
    get isPage() {
        return this.gutterMode === 'page';
    }
}
