declare module 'ember-animated/motions/move' {
    import Motion from 'ember-animated/-private/motion';
    import Sprite from 'ember-animated/-private/sprite';

    export class Move extends Motion {}

    export default function move(sprite: Sprite, opts?: object): (sprite: Sprite, innerOpts: object) => Move;
}
