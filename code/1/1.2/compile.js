const { compile } = require('nexe');

compile({
  input: './src/main.js',
  output: '../../../Deliverables/1/1.2/runme',
  target: 'linux-x86-10.11.0'
}).then(() => {
  console.log('build completed.')
}).catch((error) => {
  console.log(`build failed ${ error }`);
});
