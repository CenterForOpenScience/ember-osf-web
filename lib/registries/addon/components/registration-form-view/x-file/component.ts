import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { Answerable } from '../component';

@tagName('')
export default class ViewFile extends Component {
    answerable!: Answerable;

    @alias('answerable.extra') fileList!: object[];
}
