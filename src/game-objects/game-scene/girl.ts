import Character from './character';

class Girl extends Character {
  constructor() {
    super('girl');
  }

  get hasPressAndRelease() {
    return true;
  }

  protected get _increaseSpeedMilestone() {
    return 20000;
  }

  protected get _totalAllowedJumps() {
    return 1;
  }
}

export default Girl;
