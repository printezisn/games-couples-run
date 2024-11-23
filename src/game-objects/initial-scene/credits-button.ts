import { LinkButtonComponent } from '@printezisn/game-engine';
import config from '../../config';

class CreditsButton extends LinkButtonComponent {
  constructor() {
    super({
      label: 'credits-button',
      url: config.creditsUrl,
      resource: 'credits-button.png',
      hoverResource: 'credits-button-hover.png',
      disabledResource: 'credits-button.png',
      interactive: true,
      cursor: 'pointer',
      position: { x: 155, y: 24 },
      alpha: 0,
      anchor: 0.5,
      scale: 0,
      animations: [
        {
          from: { alpha: 0, scaleX: 0, scaleY: 0 },
          to: { alpha: 1, scaleX: 1, scaleY: 1 },
          duration: 0.5,
          delay: 1.7,
        },
      ],
    });
  }
}

export default CreditsButton;
