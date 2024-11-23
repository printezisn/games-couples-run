import { TextComponent } from '@printezisn/game-engine';

class Logo extends TextComponent {
  constructor() {
    super({
      label: 'logo',
      text: 'COUPLES RUN',
      textColor: 0xffcc00,
      fontSize: 128,
      fontFamily: 'Lobster',
      anchor: { x: 0.5, y: 0 },
      position: { x: 0, y: 50 },
      strokeColor: 0xff0000,
      strokeWidth: 7,
      alpha: 0,
      horizontalAlignment: 'center',
      landscape: {
        fontSize: 128,
      },
      portrait: {
        fontSize: 86,
      },
      animations: [
        {
          duration: 1,
          from: { alpha: 0, y: 0 },
          to: { alpha: 1, y: 50 },
          ease: 'back.out(2)',
        },
      ],
    });
  }

  protected _onOrientationChange() {
    this.finishAnimations();
  }
}

export default Logo;
