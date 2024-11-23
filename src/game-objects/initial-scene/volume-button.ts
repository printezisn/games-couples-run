import { VolumeButtonComponent } from '@printezisn/game-engine';

class VolumeButton extends VolumeButtonComponent {
  constructor() {
    super({
      label: 'volume-button',
      resource: 'volume-on.png',
      hoverResource: 'volume-on-hover.png',
      disabledResource: 'volume-on.png',
      mutedResource: 'volume-off.png',
      mutedHoverResource: 'volume-off-hover.png',
      mutedDisabledResource: 'volume-off.png',
      interactive: true,
      cursor: 'pointer',
      alpha: 0,
      position: { x: 24, y: 24 },
      scale: 0,
      anchor: 0.5,
      animations: [
        {
          from: { alpha: 0, scaleX: 0, scaleY: 0 },
          to: { alpha: 1, scaleX: 1, scaleY: 1 },
          duration: 0.5,
          delay: 1.5,
        },
      ],
    });
  }
}

export default VolumeButton;
