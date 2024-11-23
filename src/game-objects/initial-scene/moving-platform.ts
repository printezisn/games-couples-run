import {
  ContainerComponent,
  type DisplayObject,
  engineGameState,
  TilingSpriteComponent,
} from '@printezisn/game-engine';

const TOTAL_MIDDLE_PLATFORMS = 2;

class MovingPlatform extends ContainerComponent {
  constructor() {
    super({
      label: 'moving-platform',
      components: [
        new TilingSpriteComponent({
          label: 'moving-platform-top',
          resource: 'platform-top.png',
          onTick: (c: DisplayObject) => {
            (c as TilingSpriteComponent).tilePosition.x--;
            return 1;
          },
        }),
        new TilingSpriteComponent({
          label: 'moving-platform-middle',
          resource: 'platform-middle.png',
          onTick: (c: DisplayObject) => {
            (c as TilingSpriteComponent).tilePosition.x--;
          },
        }),
      ],
    });

    this._onResize();
  }

  protected _onResize() {
    const platformTop = this.getComponent<TilingSpriteComponent>(
      'moving-platform-top',
    );
    const platformMiddle = this.getComponent<TilingSpriteComponent>(
      'moving-platform-middle',
    );

    platformMiddle.width = engineGameState.screen.width;
    platformMiddle.height =
      platformMiddle.originalHeight * TOTAL_MIDDLE_PLATFORMS;
    platformMiddle.position.y =
      engineGameState.screen.height - platformMiddle.height;

    platformTop.width = engineGameState.screen.width;
    platformTop.position.y =
      engineGameState.screen.height -
      platformMiddle.height -
      platformTop.height;
  }
}

export default MovingPlatform;
