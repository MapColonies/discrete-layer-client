import vest, { test, enforce } from 'vest';
// import { IVestResult } from 'vest/vestResult';

const suite = vest.create((data = {}): any => {

  test('directory', 'Directory is required', () => {
    enforce(data.directory).isNotEmpty();
  });

  test('fileNames', 'File name is required', () => {
    enforce(data.fileNames).isNotEmpty();
  });

  test('version', 'Minimum of 2 required.', () => {
    enforce(data.version).greaterThan(1);
  });

});

// eslint-disable-next-line
export default suite;
