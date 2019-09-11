import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { parallel } from 'ember-animated';
import Sprite from 'ember-animated/-private/sprite';
import { easeIn } from 'ember-animated/easings/cosine';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

import { layout } from 'ember-osf-web/decorators/component';
import { FilesManager } from 'osf-components/components/files/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SelectedFilesList extends Component {
    // Required
    filesManager!: FilesManager;

    *transition(context: { insertedSprites: Sprite[], keptSprites: Sprite[], removedSprites: Sprite[] }) {
        const { insertedSprites, keptSprites, removedSprites } = context;

        insertedSprites.forEach((sprite: Sprite) => fadeIn(sprite));
        keptSprites.forEach((sprite: Sprite) => {
            parallel(
                fadeIn(sprite),
                move(sprite, { easing: easeIn }),
            );
        });
        removedSprites.forEach((sprite: Sprite) => fadeOut(sprite));

        yield;
    }
}
