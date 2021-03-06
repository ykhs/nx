import { newApp, newLib, newProject, readFile, runCLI, updateFile } from '../utils';

describe('Lint', () => {
  it(
    'should ensure module boundaries',
    () => {
      newProject();
      newApp('myapp');
      newLib('mylib');
      newLib('lazylib');

      const tslint = JSON.parse(readFile('tslint.json'));
      tslint.rules['nx-enforce-module-boundaries'][1].lazyLoad.push('lazylib');
      updateFile('tslint.json', JSON.stringify(tslint, null, 2));

      updateFile(
        'apps/myapp/src/main.ts',
        `
      import '../../../libs/mylib';
      import '@proj/lazylib';
    `
      );

      const out = runCLI('lint --type-check', { silenceError: true });
      expect(out).toContain('relative imports of libraries are forbidden');
      expect(out).toContain('import of lazy-loaded libraries are forbidden');
    },
    100000
  );
});
