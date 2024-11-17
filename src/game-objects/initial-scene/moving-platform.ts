import {
  ContainerComponent,
  engineGameState,
  TilingSpriteComponent,
} from '@printezisn/game-engine';

const TOTAL_MIDDLE_PLATFORMS = 2;

class MovingPlatform extends ContainerComponent {
  constructor() {
    super({
      label: 'moving-platform',
    });

    this.addComponent(
      new TilingSpriteComponent({
        label: 'moving-platform-top',
        resource: 'platform-top.png',
      }),
    );
    this.addComponent(
      new TilingSpriteComponent({
        label: 'moving-platform-middle',
        resource: 'platform-middle.png',
      }),
    );

    this._onResize();
  }

  protected get _platformTop() {
    return this.components[0] as TilingSpriteComponent;
  }

  protected get _platformMiddle() {
    return this.components[1] as TilingSpriteComponent;
  }

  protected _onResize() {
    this._platformMiddle.width = engineGameState.screen.width;
    this._platformMiddle.height =
      this._platformMiddle.originalHeight * TOTAL_MIDDLE_PLATFORMS;
    this._platformMiddle.position.y =
      engineGameState.screen.height - this._platformMiddle.height;

    this._platformTop.width = engineGameState.screen.width;
    this._platformTop.position.y =
      engineGameState.screen.height -
      this._platformMiddle.height -
      this._platformTop.height;
  }

  protected _onTick() {
    this._platformTop.tilePosition.x--;
    this._platformMiddle.tilePosition.x--;
  }
}

export default MovingPlatform;
