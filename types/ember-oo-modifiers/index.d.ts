import { A } from '@ember/array';
import Computed from '@ember/object/computed';
import Service from '@ember/service';

export default class Modifier {
    static modifier(a: typeof Modifier): unknown;

    element: HTMLElement;
}
