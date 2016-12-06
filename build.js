const NWB = require('nwjs-builder');
console.log('Building');
NWB.commands.nwbuild(__dirname+'/', {
    version:'0.14.7',
    platforms:'win32,osx64,linux64',
    outputDir:'./build',
    sideBySide:true,
    winIco:'./img/icon.ico',
    macIcns:'./img/icon.icns',
    executableNam:'Arduino External Editor'

}, function(){
    console.log('Done and Done');
});