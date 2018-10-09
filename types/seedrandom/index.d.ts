class SeedRandom {
    constructor(seed: string | number);
}

interface SeedRandom {
    (): number; // tslint:disable-line callable-types
}

export default SeedRandom;
