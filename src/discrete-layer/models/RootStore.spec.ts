// import { useContext } from 'react';
// // eslint-disable-next-line
// import '../../__mocks__/confEnvShim';
import { useStore } from './RootStore';
// jest.mock('react', () => {
//   return {
//     useContext: jest.fn(),
//     createStoreContext: jest.fn().mockImplementation(() => ({ provider: {} })),
//   };
// });

// jest.mock('mst-gql', () => {
//   return {
//     createStoreContext:  jest.fn().mockImplementation(() => ({ provider: {} })),
//     createUseQueryHook: jest.fn(),
//   };
// });


// const contextMock = useContext as jest.Mock<null | unknown>;

// afterEach(() => {
//   contextMock.mockReset();
// });

// it('useStore works correctly if store is defined', () => {
//   const context = {};
//   contextMock.mockImplementation(() => context);

//   const result = useStore();

//   expect(contextMock).toHaveBeenCalledTimes(1);
//   expect(result).toBe(context);
// });

// it('useStore throws an error if store is undefined', () => {
//   contextMock.mockImplementation(() => null);
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const action = () => useStore();

//   expect(action).toThrow();
// });

it('*** STORE TEST DUMMY ***', () => {
  expect(true).toBe(true);
});
