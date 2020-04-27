import { faker } from 'ember-cli-mirage';

export function placekitten(width: number, height: number, n: number = 12) {
    return `https://placekitten.com/${width}/${height}?image=${n}`;
}

export function randomGravatar(size?: number) {
    let url = `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
    if (size) {
        url = `${url}&s=${size}`;
    }
    return url;
}
