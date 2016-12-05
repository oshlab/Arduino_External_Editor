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

Now we need to install the nwjs package

`npm install nw@0.14.7-sdk --nwjs_build_type=sdk`

To start run 
`npm start`