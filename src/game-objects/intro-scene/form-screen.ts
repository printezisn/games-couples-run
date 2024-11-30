import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  LinkButtonComponent,
  SpriteComponent,
  TextComponent,
} from '@printezisn/game-engine';
import config from '../../config';
import IntroScene from '../../scenes/intro-scene';

class FormScreen extends ContainerComponent {
  private _accepted = false;
  private _nickname = localStorage.getItem('couplesRun_nickname') ?? '';

  constructor() {
    super({
      label: 'form-screen',
      alpha: 0,
    });

    this.addComponent(
      new TextComponent({
        label: 'text',
        text: 'Enter your nickname:',
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xffcc00,
        landscape: {
          position: { x: 20, y: 44 },
          anchor: { x: 0, y: 0.5 },
        },
        portrait: {
          position: { x: 20, y: 20 },
          anchor: 0,
        },
      }),
    );

    this.addComponent(
      new InputComponent({
        background: 'input.png',
        fontFamily: 'Arial, sans-serif',
        fontSize: 24,
        label: 'nickname',
        textColor: 0x000000,
        text: this._nickname,
        maxLength: 10,
        padding: 10,
        landscape: {
          position: { x: 520, y: 20 },
        },
        portrait: {
          position: { x: 20, y: 80 },
        },
        onChange: (text) => {
          this._nickname = text;
          playButton.enabled =
            Boolean(this._nickname?.trim()) && this._accepted;
          playButton.interactive = playButton.enabled;
        },
      }),
    );

    const checkbox = this.addComponent(
      new SpriteComponent({
        label: 'checkbox',
        resource: 'checkbox-off.png',
        interactive: true,
        cursor: 'pointer',
        landscape: {
          position: { x: 20, y: 120 },
        },
        portrait: {
          position: { x: 20, y: 180 },
        },
        onClick: () => {
          this._accepted = !this._accepted;
          playButton.enabled =
            Boolean(this._nickname?.trim()) && this._accepted;
          playButton.interactive = playButton.enabled;
          checkbox.texture = this._accepted
            ? 'checkbox-on.png'
            : 'checkbox-off.png';
        },
      }),
    );

    this.addComponent(
      new TextComponent({
        label: 'agreement',
        fontFamily: 'PressStart2P',
        fontSize: 24,
        textColor: 0xffcc00,
        text: '',
        lineHeight: 40,
        landscape: {
          position: { x: 100, y: 125 },
          text: 'By accepting you agree to the privacy policy',
        },
        portrait: {
          position: { x: 100, y: 185 },
          text: 'By accepting you agree to\nthe privacy policy',
        },
      }),
    );

    const buttons = this.addComponent(
      new ContainerComponent({
        label: 'buttons',
        landscape: {
          y: 250,
        },
        portrait: {
          y: 340,
        },
        horizontalAlignment: 'center',
        width: 650,
      }),
    );

    buttons.addComponent(
      new LinkButtonComponent({
        label: 'policy-button',
        url: config.privacyPolicyUrl,
        resource: 'policy-button.png',
        hoverResource: 'policy-button-hover.png',
        disabledResource: 'policy-button.png',
        interactive: true,
        cursor: 'pointer',
      }),
    );

    const playButton = buttons.addComponent(
      new ButtonComponent({
        label: 'play-button',
        resource: 'play-button.png',
        hoverResource: 'play-button-hover.png',
        disabledResource: 'play-button-disabled.png',
        position: { x: 350, y: 0 },
        cursor: 'pointer',
        onClick: async () => {
          playButton.interactive = false;
          localStorage.setItem('couplesRun_nickname', this._nickname);
          (this.parent as IntroScene).goToGame();
        },
      }),
    );

    playButton.enabled = false;

    this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 1,
    });
  }
}

export default FormScreen;
