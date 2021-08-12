import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import move from 'ember-animated/motions/move';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class AnimatedExpandComponent extends Component {
    // eslint-disable-next-line require-yield
    *expandListTransition({ insertedSprites, removedSprites }: any): IterableIterator<unknown> {
        for (const sprite of insertedSprites) {
            sprite.startTranslatedBy(0, -sprite.finalBounds.height);
            move(sprite);
        }

        for (const sprite of removedSprites) {
            sprite.endTranslatedBy(0, -sprite.initialBounds.height);
            move(sprite);
        }
    }
}
