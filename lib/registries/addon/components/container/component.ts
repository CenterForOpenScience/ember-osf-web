import { className, layout } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';
import hbs from 'htmlbars-inline-precompile';

import { localClassNames } from 'ember-osf-web/decorators/css-modules';

@layout(hbs`{{yield}}`)
@localClassNames('Container')
export default class RegistriesContainer extends Component {
    @service media!: Media;

    @className @alias('media.classNames') mediaClasses!: string;
}
