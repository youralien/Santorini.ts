# Deliverable 1.2

## Setup
1. Make sure you have [Node.js](https://nodejs.org/en/) installed. 
2. Run `npm install` to get any needed dependencies. 

## Building Binary Executable
To build the binary executable, you will need [nexe](https://github.com/nexe). You can either follow the instructions provided by nexe, or use our build scripts:
1. Follow the Setup steps above to make sure you have the needed dependencies. 
2. Run `npm run compile` to build the executable application. 

## Building ES5 Compatible Code
1. Follow the Setup steps above to make sure you have the needed dependencies.
2. Run `npm run build` to transpile the code into ES5-friendly code.

## Usage
Both the Node.js and packaged binary executable can be run in two modes: (1) live user input; and (2) pre-streamed input. We provide several input files and their respective expected output files to test the code for (2). Execution of both methods is detailed below. 

All built/compiled files can be found in Deliverables/1/1.2. The instructions below assume you are in this directory.

### Node.js Application
1. Run `./runme.sh`. The application will wait for your input and keep listing to your input until you press `ctrl-d` to exit, after which it will output the modified JSON. 
2. Run `./runme.sh < inputX` where `X` is replaced by the input file number you desire.

### Packaged Executable Application
1. Run `./runme`. The application will wait for your input and keep listing to your input until you press `ctrl-d` to exit, after which it will output the modified JSON.
2. Run `./runme < inputX` where `X` is replaced by the input file number you desire.
