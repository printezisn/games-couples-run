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

const INTRO =
  'The night has fallen deep and the young(?) couple is ' +
  "ready to get married, but a tragedy happens. They're " +
  'out of drinks in the party. They go out to get more ' +
  'drinks for the guests and they engage into a zombie ' +
  'apocalypse.\n\n' +
  'Collect as many drinks as you can to increase your ' +
  'score. You lose a life point each time an enemy ' +
  "touches you. It's game over if you lose 3 life " +
  'points or you fall into a pit. Jump to avoid enemies and pits.';

const CHARACTER_EXPLANATION =
  'You can make both characters jump by clicking/tapping on the screen. ' +
  'Anastasia can reduce her speed if you click/tap on the screen and hold it for a while. ' +
  'She then jumps higher when you release it. ' +
  'Nikos can perform a double jump if you click/tap on the screen again while jumping.';

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

    if (!config.hasWatchedIntro) {
      await this._createText(INTRO);

      await this.delay(15);
      await this._hideIntro();
    }

    localStorage.setItem('couplesRun_watchedIntro', 'true');

    await this._createText(CHARACTER_EXPLANATION);

    this.addComponent(
      new TextComponent({
        label: 'choose-character',
        text: 'Choose Character',
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xffcc00,
        anchor: { x: 0.5, y: 0 },
        alpha: 0,
        position: {
          x: 0,
          y:
            this._characterExplanationComponent.y +
            this._characterExplanationComponent.height +
            40,
        },
        horizontalAlignment: 'center',
      }),
    );
    this.addComponent(new Selection());

    this._selectionComponent.y =
      this._chooseCharacterComponent.y +
      this._chooseCharacterComponent.height +
      40;

    this._registerToSignal(
      config.signals.chooseCharacter,
      this._onCharacterSelection,
    );

    await Promise.all([
      this._chooseCharacterComponent.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1,
      }),
      this._selectionComponent.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1,
      }),
    ]);
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

  private async _createText(text: string) {
    const component = this.addComponent(
      new TextComponent({
        label: 'introduction',
        text,
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xcccccc,
        alpha: 0,
        position: { x: 20, y: 20 },
        wordWrap: true,
        wordWrapWidth: engineGameState.screen.width - 40,
        align: 'justify',
        lineHeight: 40,
      }),
    );

    await component.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 3,
    });
  }

  private async _hideIntro() {
    await this._introComponent.animate({
      from: { alpha: 1 },
      to: { alpha: 0 },
      duration: 3,
    });

    this._introComponent.destroy();
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
