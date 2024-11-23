import {
  ButtonComponent,
  ContainerComponent,
  engineGameState,
  TextComponent,
} from '@printezisn/game-engine';
import IntroScene from '../../scenes/intro-scene';

const TEXT =
  'The night has fallen deep and the young(?) couple is ' +
  "ready to get married, but a tragedy happens. They're " +
  'out of drinks in the party. They go out to get more ' +
  'drinks for the guests and they engage into a zombie ' +
  'apocalypse.\n\n' +
  'Collect as many drinks as you can to increase your ' +
  'score. You lose a life point each time an enemy ' +
  "touches you. It's game over if you lose 3 life " +
  'points or you fall into a pit. Jump to avoid enemies and pits.';

class IntroScreen extends ContainerComponent {
  constructor() {
    super({
      label: 'introduction-screen',
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

    const button = this.addComponent(
      new ButtonComponent({
        label: 'continue-button',
        resource: 'continue-button.png',
        hoverResource: 'continue-button-hover.png',
        disabledResource: 'continue-button.png',
        position: { x: 0, y: text.y + text.height + 40 },
        horizontalAlignment: 'center',
        interactive: false,
        cursor: 'pointer',
        anchor: { x: 0.5, y: 0 },
        onClick: async () => {
          button.interactive = false;
          await this.animate({
            from: { alpha: 1 },
            to: { alpha: 0 },
            duration: 1,
          });

          (this.parent as IntroScene).showCharacterSelectionScreen();
        },
      }),
    );

    this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 1,
    }).then(() => {
      button.interactive = true;
    });
  }

  protected _onResize() {
    const text = this.components[0] as TextComponent;
    text.wordWrapWidth = engineGameState.screen.width - 40;

    const button = this.components[1] as ButtonComponent;
    button.y = text.y + text.height + 40;
  }
}

export default IntroScreen;
