import {
  BaseScene,
  fadeInSound,
  fadeOutSound,
  fireSignal,
  MovingBackgroundComponent,
} from '@printezisn/game-engine';
import config from '../config';
import IntroScreen from '../game-objects/intro-scene/intro-screen';
import CharacterSelectionScreen from '../game-objects/intro-scene/character-selection-screen';
import FormScreen from '../game-objects/intro-scene/form-screen';

class IntroScene extends BaseScene {
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
  }

  showCharacterSelectionScreen() {
    this.components[1].destroy();
    this.addComponent(new CharacterSelectionScreen());
  }

  showFormScreen() {
    this.components[1].destroy();
    this.addComponent(new FormScreen());
  }

  async goToGame() {
    await Promise.all([
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
