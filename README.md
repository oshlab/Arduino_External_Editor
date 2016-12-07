### An External Editor For Arduino

This project uses nw.js and the ace editor to make a better editor for Arduino.
It includes a virtual filesystem.

####This project is currently in early alpha. There will be bugs.
 
 You can download the project on the [Release page](https://github.com/oshlab/Arduino_External_Editor/releases)
 
 Get more info at [https://oshlab.com/arduinoeditor](https://oshlab.com/arduinoeditor)
 
![Arduino External Editor](https://oshlab.com/wp-content/uploads/2016/12/Screenshot-2016-12-05-13.07.11.png "Arduino External Editor")

#### Change Log
V0.0.1 - Initial alpha release 
 

#### Developing
To install for now, you need node js v > 4

clone this directory

`git clone https://github.com/oshlab/Arduino_External_Editor.git`

`cd Arduino_External_Editor`

You need the nwjs-builder
`npm install nwjs-builder -g`

To run 
`npm start`

#### Building

Note, the builder builds everything in the folder. Therefore, the builder will output files in one 
folder above called AEE_build
You need the nwjs-builder
`npm install nwjs-builder -g`

Run the following command to build for all platforms in production mode. It will also zip them. 
`npm run-script build-production`

The following commands will build in sdk mode (console, inspector mode). You can build all or just the one you want. 
Just run one of the following. They are pretty self explanatory.

`npm run-script build-all-sdk`
`npm run-script build-win-sdk`
`npm run-script build-mac-sdk`
`npm run-script build-linux-sdk`