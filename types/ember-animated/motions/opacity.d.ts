declare module 'ember-animated/motions/opacity' {
    import Motion from 'ember-animated/-private/motion';
    import Sprite from 'ember-animated/-private/sprite';

    export class Opacity extends Motion {}

    export function fadeIn(sprite: Sprite, opts?: object): (sprite: Sprite, innerOpts: object) => Opacity;
    export function fadeOut(sprite: Sprite, opts?: object): (sprite: Sprite, innerOpts: object) => Opacity;
}
