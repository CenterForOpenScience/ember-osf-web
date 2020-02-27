import { className } from '@ember-decorators/component';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { localClassNames } from 'ember-css-modules';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('Container')
export default class RegistriesContainer extends Component {
    @service media!: Media;

    @className @alias('media.classNames') mediaClasses!: string;
}
