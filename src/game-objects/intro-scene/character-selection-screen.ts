import {
  ContainerComponent,
  engineConfig,
  engineGameState,
  playSound,
  TextComponent,
} from '@printezisn/game-engine';
import Selection from './selection';
import config from '../../config';
import IntroScene from '../../scenes/intro-scene';

const TEXT =
  'You can make both characters jump by clicking/tapping on the screen. ' +
  'Anastasia can reduce her speed if you click/tap on the screen and hold it for a while. ' +
  'She then jumps higher when you release it. ' +
  'Nikos can perform a double jump if you click/tap on the screen again while jumping.';

class CharacterSelectionScreen extends ContainerComponent {
  constructor() {
    super({
      label: 'character-selection-screen',
      alpha: 0,
    });

    const text = this.addComponent(
      new TextComponent({
        label: 'text',
        text: TEXT,
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xcccccc,
        position: { x: 20, y: 20 },
        wordWrap: true,
        wordWrapWidth: engineGameState.screen.width - 40,
        align: 'justify',
        lineHeight: 40,
      }),
    );

    const chooseCharacter = this.addComponent(
      new TextComponent({
        label: 'choose-character',
        text: 'Choose Character',
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xffcc00,
        anchor: { x: 0.5, y: 0 },
        position: {
          x: 0,
          y: text.y + text.height + 40,
        },
        horizontalAlignment: 'center',
      }),
    );

    const selection = this.addComponent(new Selection());

    selection.y = chooseCharacter.y + chooseCharacter.height + 40;

    this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 1,
    });

    this._registerToSignal(
      config.signals.chooseCharacter,
      this._onCharacterSelection,
    );
  }

  protected _onResize() {
    const text = this.components[0] as TextComponent;
    const chooseCharacter = this.components[1] as TextComponent;
    const selection = this.components[2] as Selection;

    text.wordWrapWidth = engineGameState.screen.width - 40;
    chooseCharacter.y = text.y + text.height + 40;
    selection.y = chooseCharacter.y + chooseCharacter.height + 40;
  }

  private async _onCharacterSelection() {
    await Promise.all([
      playSound(engineConfig.sounds.click),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 1,
        delay: 0.3,
      }),
    ]);

    (this.parent as IntroScene).showFormScreen();
  }
}

export default CharacterSelectionScreen;
