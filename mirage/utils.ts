import { faker } from 'ember-cli-mirage';

const images = [
    '/assets/mirage/images/gravatar_1.png',
    '/assets/mirage/images/gravatar_2.png',
    '/assets/mirage/images/gravatar_3.png',
    '/assets/mirage/images/gravatar_4.png',
    '/assets/mirage/images/gravatar_5.png',
];

export function randomStaticGravatar() {
    const min = 0;
    const max = 4;
    const selection = Math.floor((Math.random() * (max - (min + 1))) + min);
    return images[selection];
}

export function randomGravatar(size?: number) {
    let url = `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
    if (size) {
        url = `${url}&s=${size}`;
    }
    return url;
}
