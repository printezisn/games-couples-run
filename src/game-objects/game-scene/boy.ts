import Character from './character';

class Boy extends Character {
  constructor() {
    super('boy');
  }

  get hasPressAndRelease() {
    return false;
  }

  protected get _increaseSpeedMilestone() {
    return 10000;
  }

  protected get _totalAllowedJumps() {
    return 2;
  }
}

export default Boy;
