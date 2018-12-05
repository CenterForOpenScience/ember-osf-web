import { className } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
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
