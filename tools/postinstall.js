import fs from 'fs';
import path from 'path';

const game = 'couples-run';

let dir = import.meta.dirname;
while (!fs.existsSync(path.join(dir, 'public'))) {
  dir = path.dirname(dir);
}

fs.rmSync(path.join(dir, 'public', 'games', game), {
  recursive: true,
});

fs.mkdirSync(path.join(dir, 'public', 'games', game), {
  recursive: true,
});

fs.cpSync(
  path.join('dist', 'images'),
  path.join(dir, 'public', 'games', game),
  {
    recursive: true,
  },
);

fs.cpSync(
  path.join('dist', 'assets'),
  path.join(dir, 'public', 'games', game, 'assets'),
  {
    recursive: true,
  },
);
