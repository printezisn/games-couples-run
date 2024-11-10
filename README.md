# Couples Run

Join forces with your partner in the ultimate couples' platformer game! Collect as many drinks as you can to boost your score while dodging relentless enemies and treacherous pits. Are you and your partner ready to take on the adventure and become the ultimate duo? Play now!

## Prerequisites

1. Install **NodeJS** >= 20.0.0. If you already have **nvm**, you can just do the following steps:
   1. `nvm install`
   1. `nvm use`
1. Install **pnpm** (e.g. with `npm i -g pnpm`).
1. Download the node packages with `pnpm i`.
1. Install **ffmpeg** to convert audio files.

## Stack

1. Typescript
1. [PixiJS](https://pixijs.com/) for 2D graphics.
1. [GSAP](https://gsap.com/) for animations.
1. [PixiJS Sound](https://pixijs.io/sound/examples/index.html) for playing sounds.
1. [PixiJS Assetpack](https://pixijs.io/assetpack/) for packing and optimizing assets.
1. [MatterJS](https://brm.io/matter-js/) for game physics.
1. [Audiosprite](https://github.com/tonistiigi/audiosprite) to combine audio files.

## Scripts

1. `pnpm start:dev`: starts the game in development mode.
1. `pnpm build`: builds the game and makes it ready to be consumed by web applications.
1. `pnpm lint`: uses eslint to find linting issues.
1. `pnpm lint:fix`: uses eslint to find linting issues and fix them if possible.
1. `pnpm prettier:format`: uses prettier to find formatting issues and fix them if possible.
