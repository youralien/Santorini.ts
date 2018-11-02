const { compile } = require('nexe');

compile({
  input: './src/main.js',
  output: '../../../Deliverables/2/2.1/runme',
  target: 'linux-x86-10.11.0'
}).then(() => {
  console.log('build completed.')
}).catch((error) => {
  console.log(`build failed ${ error }`);
});
