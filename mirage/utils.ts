import { faker } from 'ember-cli-mirage';

const images = [
    '/assets/mirage/images/gravatar_1.png',
    '/assets/mirage/images/gravatar_2.png',
    '/assets/mirage/images/gravatar_3.png',
    '/assets/mirage/images/gravatar_4.png',
    '/assets/mirage/images/gravatar_5.png',
];

export function randomStaticGravatar() {
    const selection = Math.floor(Math.random() * Math.floor(5));
    return images[selection];
}

export function randomGravatar(size?: number) {
    let url = `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
    if (size) {
        url = `${url}&s=${size}`;
    }
    return url;
}
