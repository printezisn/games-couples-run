import gameState from '../game-state';
import {
  BaseScene,
  ContainerComponent,
  engineConfig,
  fireSignal,
  TextComponent,
} from '@printezisn/game-engine';
import { getLeaderboard, getPlayerId, saveScore } from '../api/storage';
import type { PlayerScore } from '../api/types';
import config from '../config';

class GameOverScene extends BaseScene {
  private _leaderboard: PlayerScore[] = [];

  async init() {
    const gameOverTitle = this.addComponent(
      new TextComponent({
        label: 'game-over',
        text: 'Game Over',
        fontFamily: engineConfig.loadingScene.fontFamily,
        fontSize: 48,
        textColor: engineConfig.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        margin: { x: 0, y: -50 },
      }),
    );

    const scoreText = this.addComponent(
      new TextComponent({
        label: 'score',
        text: `Your score is ${gameState.score}`,
        fontFamily: engineConfig.loadingScene.fontFamily,
        fontSize: 28,
        textColor: engineConfig.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        margin: { x: 0, y: 50 },
      }),
    );

    await Promise.all([this.delay(2), this._saveAndGetLeaderboard()]);
    if (this._leaderboard.length === 0) {
      fireSignal(config.signals.goToGame);
      return;
    }

    await Promise.all([
      gameOverTitle.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 1,
      }),
      scoreText.animate({ from: { alpha: 1 }, to: { alpha: 0 }, duration: 1 }),
    ]);

    gameOverTitle.destroy();
    scoreText.destroy();

    this._showLeaderboard();
    await this.delay(2 + 0.5 * (this._leaderboard.length + 1));
    fireSignal(config.signals.goToGame);
  }

  private _showLeaderboard() {
    const leaderboard = this.addComponent(
      new ContainerComponent({
        label: 'leaderboard',
        height: 549,
        verticalAlignment: 'center',
      }),
    );
    let y = 0;

    y +=
      leaderboard.addComponent(
        new TextComponent({
          label: 'title',
          text: 'Leaderboard',
          fontFamily: engineConfig.loadingScene.fontFamily,
          fontSize: 48,
          textColor: engineConfig.loadingScene.textColor,
          anchor: { x: 0.5, y: 0 },
          horizontalAlignment: 'center',
          alpha: 0,
          animations: [
            {
              from: { alpha: 0 },
              to: { alpha: 1 },
              duration: 0.5,
            },
          ],
        }),
      ).height + 50;

    this._leaderboard.forEach((player, i) => {
      const textColor =
        player.id === getPlayerId()
          ? 0xffcc00
          : engineConfig.loadingScene.textColor;
      const text =
        `${i + 1}. ${player.nickname}`.padEnd(50, ' ') + player.score;

      y +=
        leaderboard.addComponent(
          new TextComponent({
            label: `player-${i}`,
            text,
            fontFamily: engineConfig.loadingScene.fontFamily,
            fontSize: 24,
            textColor,
            anchor: { x: 0.5, y: 0 },
            horizontalAlignment: 'center',
            position: { x: 0, y },
            alpha: 0,
            animations: [
              {
                from: { alpha: 0 },
                to: { alpha: 1 },
                duration: 0.5,
                delay: 0.5 * (i + 1),
              },
            ],
          }),
        ).height + 20;
    });
  }

  private async _saveAndGetLeaderboard() {
    if (!(await saveScore(gameState.score))) return [];

    this._leaderboard = await getLeaderboard();
  }
}

export default GameOverScene;
