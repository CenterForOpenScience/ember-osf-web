import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';

import { Answerable } from '../component';

@tagName('')
export default class ViewFile extends Component {
    answerable!: Answerable;

    @alias('answerable.extra') fileList!: object[];
}
