import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { parallel } from 'ember-animated';
import Sprite from 'ember-animated/-private/sprite';
import { easeIn } from 'ember-animated/easings/cosine';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import pathJoin from 'ember-osf-web/utils/path-join';

import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class SelectedFilesList extends Component {
    node!: Node;

    didReceiveAttrs() {
        assert('Files::SelectedList requires @node!', Boolean(this.node));
    }

    @computed('node')
    get nodeUrl() {
        return this.node && pathJoin(baseURL, this.node.id);
    }

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
