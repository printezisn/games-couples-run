#! /usr/bin/env node

import fs from 'fs';
import path from 'path';

const game = 'couples-run';

// eslint-disable-next-line
const dir = process.cwd();

fs.rmSync(path.join(dir, 'public', 'games', game), {
  recursive: true,
});

fs.mkdirSync(path.join(dir, 'public', 'games', game), {
  recursive: true,
});

fs.cpSync(
  path.join(import.meta.dirname, '..', 'dist', 'images'),
  path.join(dir, 'public', 'games', game),
  {
    recursive: true,
  },
);

fs.cpSync(
  path.join(import.meta.dirname, '..', 'dist', 'assets'),
  path.join(dir, 'public', 'games', game, 'assets'),
  {
    recursive: true,
  },
);
