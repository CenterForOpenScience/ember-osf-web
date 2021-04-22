class SeedRandom {
    constructor(seed: string | number);
}

interface SeedRandom {
    (): number; // eslint-disable-line  @typescript-eslint/prefer-function-type
}

export default SeedRandom;
