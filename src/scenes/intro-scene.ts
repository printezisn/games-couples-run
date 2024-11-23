import {
  BaseScene,
  engineConfig,
  engineGameState,
  fadeInSound,
  fadeOutSound,
  fireSignal,
  MovingBackgroundComponent,
  playSound,
  TextComponent,
} from '@printezisn/game-engine';
import config from '../config';
import Selection from '../game-objects/intro-scene/selection';
import IntroScreen from '../game-objects/intro-scene/intro-screen';
import CharacterSelectionScreen from '../game-objects/intro-scene/character-selection-screen';

class IntroScene extends BaseScene {
  private get _introComponent() {
    return this.components[1] as TextComponent;
  }

  private get _characterExplanationComponent() {
    return this.components[1] as TextComponent;
  }

  private get _chooseCharacterComponent() {
    return this.components[2] as TextComponent;
  }

  private get _selectionComponent() {
    return this.components[3] as Selection;
  }

  async init() {
    this.alpha = 0;

    this.addComponent(
      new MovingBackgroundComponent({
        label: 'city-bg',
        resource: 'city-bg.png',
      }),
    );

    await Promise.all([
      this.animate({ from: { alpha: 0 }, to: { alpha: 1 }, duration: 2 }),
      fadeInSound(config.sounds.menuLoop, {
        toVolume: 0.3,
        fadeDuration: 0.5,
        loop: true,
      }),
    ]);

    this.addComponent(new IntroScreen());

    this._registerToSignal(
      config.signals.chooseCharacter,
      this._onCharacterSelection,
    );
  }

  showCharacterSelectionScreen() {
    this.components[1].destroy();
    this.addComponent(new CharacterSelectionScreen());
  }

  protected _onResize() {
    if (this._introComponent) {
      this._introComponent.wordWrapWidth = engineGameState.screen.width - 40;
    }
    if (this._characterExplanationComponent) {
      this._characterExplanationComponent.wordWrapWidth =
        engineGameState.screen.width - 40;
    }
    if (this._chooseCharacterComponent) {
      this._chooseCharacterComponent.y =
        this._characterExplanationComponent.y +
        this._characterExplanationComponent.height +
        40;
      this._selectionComponent.y = this._chooseCharacterComponent.y + 40;
    }
  }

  private async _onCharacterSelection() {
    await Promise.all([
      playSound(engineConfig.sounds.click),
      fadeOutSound(config.sounds.menuLoop, { fadeDuration: 2 }),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 2,
      }),
    ]);

    fireSignal(config.signals.goToGame);
  }
}

export default IntroScene;
