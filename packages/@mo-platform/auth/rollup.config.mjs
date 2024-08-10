export default {
  input: 'src/index.js',
  output: {
    file: 'dist/moauth.esm.js',
    format: 'esm'
  },
  external: ['isomorphic-fetch']
};
