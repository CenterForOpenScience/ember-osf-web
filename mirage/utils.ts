import faker from 'faker';

export function placekitten(width: number, height: number, n: number = 12) {
    return `https://placekitten.com/${width}/${height}?image=${n % 17}`;
}

export function randomGravatar(size?: number) {
    let url = `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
    if (size) {
        url = `${url}&s=${size}`;
    }
    return url;
}
