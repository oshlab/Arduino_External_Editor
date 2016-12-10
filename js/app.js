/********* Setup ***************/
//TODO update this here and in package.json every version
var version = '0.0.1';

var fs = require('fs');
var path = require('path');
var filepath;
var filename;
var splitfile = {};
const {dialog} = require('electron').remote;
const {shell} = require('electron');

$(function () {
    // activate tooltips
    $('[data-toggle="tooltip"]').tooltip()
});

// open links in real browser
linkListen();

// put version number
$('.version-num').html(version);

function linkListen() {
    // unbind links
    $('a[target=_blank]').unbind('click');
    // bind links
    $('a[target=_blank]').bind('click', function () {
        shell.openExternal(this.href);
        return false;
    });
}

/********* Buttons **************/
// open dialog
$('#open-btn').click(function () {
    // var chooser = $('#fileDialog');
    // chooser.unbind('change');
    // chooser.change(function (evt) {
    //     filepath = $(this).val();
    //     filename = path.basename(filepath);
    //     console.log('Filename:' + filename);
    //     console.log('Filepath:' + filepath);
    //     $('#filename').html(filename);
    //     parseFile(filepath);
    // });
    // chooser.trigger('click');
    var tmp = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'Arduino', extensions: ['ino', 'pde']},
            {name: 'C/C++', extensions: ['c', 'cpp', 'h']},
            {name: 'All Files', extensions: ['*']}
        ]
    });
    filepath = tmp[0];
    filename = path.basename(filepath);
    console.log('Filename:' + filename);
    console.log('Filepath:' + filepath);
    $('#filename').html(filename);
    parseFile(filepath);
});

$('#save-btn').click(function () {
    saveFile();
});

$('#reparse-btn').click(function () {
    reparse();
});

/************* Help ****************/
$('#help-btn').click(function () {
    var content = '';
    content += '<div class="pull-right">' + $('.version-box').html() + '</div>';
    content += $('#additional-help').html();
    content += $('#arduino-help').html();
    content += $('#vf-help').html();
    content += $('#hotkeys-help').html();
    showModal('Help', content);
    // open links in real browser
    linkListen();
});

/************* Donate ****************/
$('.donate-button').click(function () {
    var content = '';
    content += '<h3 class="font-orange">Why Donate?</h3>' +
        '<p>This software is Open Source and free. But it take a lot of time ' +
        'to develop and takes a lot of time to continue adding new features.' +
        'I have a dream to make this software amazing. But, I still have bills to ' +
        'pay and a family to support. Your donations help me continue work on this ' +
        'software.</p><br/>' +
        '<h4 class="font-yellow"><i class="fa fa-paypal" aria-hidden="true"></i> Credit Card / Paypal</h4> ' +
        '<p>I accept donations through PayPal which will allow you to use your PayPal account ' +
        'or a credit card if you do not have a Paypal account.</p>' +
        '<p class="text-center">' +
        '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Z3PFE6KWKB4EW" target="_blank" class="btn btn-primary">' +
        '<i class="fa fa-paypal" aria-hidden="true"></i> &nbsp; Donate</a></p>' +
        '<h4 class="font-yellow"><i class="fa fa-btc" aria-hidden="true"></i> Bitcoin</h4> ' +
        '<p>I also accept donations through Bitcoin. You can send your coin to the following ' +
        'address </p><br/>' +
        '<h4 class="text-center font-green">14ExE2V92mXsEwnZhCUqkBcRxk152z3AzU</h4><br/>' +
        '<p class="text-center"><img src="./img/qrbitcoin.png"/> </p> ';
    showModal('Donate', content);
    // open links in real browser
    linkListen();
});


/************* Modal ****************/
function showModal(title, content) {
    $('#modal-title').html(title);
    $('#modal-body').html(content);
    $('#modal').modal('show');
}
/********* Notification **************/
function notify(string, addclass) {
    $('#notifier').html(string)
        .addClass(addclass)
        .slideDown(100, function () {
            setTimeout(function () {
                $('#notifier').slideUp(100, function () {
                    $(this).html('')
                        .removeClass(addclass)
                });
            }, 1000);
        })
}

/********* ACE EDITOR ***********/
// var langTools = ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/darcula");
editor.getSession().setMode("ace/mode/arduino");
document.getElementById('editor').style.fontSize = '14px';
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    fontSize: "10pt"
});
// langTools.addCompleter(arduinoCompleter);
// setup an on change event
editor.getSession().on('change', function (e) {
    // e.type, etc
//        $('#save-file').addClass('btn-success').removeClass('disabled').html('<i class="fa fa-floppy-o" aria-hidden="true"></i>');
});
// setup save command
editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
    exec: function (editor) {
        saveFile();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
    name: 'reparse',
    bindKey: {win: 'Alt-S', mac: 'Alt-S'},
    exec: function (editor) {
        reparse();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
    name: 'vftag',
    bindKey: {win: 'Alt-F', mac: 'Alt-F'},
    exec: function (editor) {
        insertVfTag();
    },
    readOnly: true // false if this command should not apply in readOnly mode
});

function parseFile(filepath) {
    // default to not ignoremode
    fs.readFile(filepath, function (err, data) {
        editor.setValue("", -1);
        if (err) {
            //throw err;
            // no file. Put blank.
            console.log(err);
            notify(err, 'bad');
        } else {
            var code;
            // console.log(data.toString());
            code = data.toString();
            // split the code
            var splitcode = code.split(/\/\/{{([0-9a-zA-z_\-\s]*)}}+/);
            console.log(splitcode);
            // put into split file object
            clearSplitfile(); // clear the object
            if (splitcode.length > 1) {
                for (var i = 1; i < splitcode.length; i = i + 2) {
                    // we remove the first and last new line in the code after split
                    splitfile[splitcode[i]] = splitcode[i + 1].replace('\n', '').replace(/\n$/, '');
                    ;

                }
            } else {
                // No tags yet. Make one
                splitfile['main'] = splitcode[0];
            }
            // console.log(splitfile);
            // show file splits
            var str = '<ul>';
            str += '<li id="allfilesbutton" class="filelink file-selected" data-id="SHOWALLFILE">SHOW ALL</li>';
            for (var key in splitfile) {
                str += '<li class="filelink" data-id="' + key + '">' + key + '</li>';
            }
            str += '</ul>';
            $('#file-breakout').html(str);
            // setup callbacks
            setupFilelink();

            // edit file
            editFile('SHOWALLFILE');

            // show the editor
            $('#welcome').hide();
            $('#sidebar').show();
            $('#editor-box').show();

        }
    }); // read file
}

function setupFilelink() {
    // setup callbacks
    $('.filelink').click(function () {
        parseCurrent();
        // remove active links
        $('.filelink').removeClass('file-selected');
        var k = $(this).attr('data-id');
        $(this).addClass('file-selected');
        // save current work to splitfile object;
        editFile(k);
    });
}
function editFile(key) {
    console.log('Editing: ' + key);
    var c = '';
    var startLine = 1;
    if (key == 'SHOWALLFILE') {
        console.log('key is showall');
        // show all file
        for (var k in splitfile) {
            c += '//{{' + k + '}}\n';
            c += splitfile[k] + '\n';
        }
    } else {
        console.log(splitfile);
        console.log('key is ' + key);
        console.log(splitfile[key]);
        c = splitfile[key];
        // increment line numbers
        for (var ke in splitfile) {
            startLine++;
            if (ke != key) {
                startLine = (splitfile[ke].split("\n").length - 1) + startLine;
                startLine++;
            } else {
                break;
            }
        }
    }
    // push to editor
    editor.setValue(c, -1);
    editor.setOption("firstLineNumber", startLine);
    // reset undo stack
    editor.getSession().setUndoManager(new ace.UndoManager());
    editor.focus();
}

function parseCurrent(parseall) {
    // pass true to reparse all
    if (typeof parseall === 'undefined') {
        parseall = false;
    }
    var content = editor.getValue();
    var key = $('.file-selected').attr('data-id');
    if (key == 'SHOWALLFILE' || parseall) {
        var splitcode = content.split(/\/\/{{([0-9a-zA-z_\-\s]*)}}+/);
        // reparse whole code
        clearSplitfile(); //clear splitfile
        for (var i = 1; i < splitcode.length; i = i + 2) {
            // we remove the first new line and last new line in the code after split
            splitfile[splitcode[i]] = splitcode[i + 1].replace('\n', '').replace(/\n$/, '');
        }
    } else {
        splitfile[key] = content;
    }
}
function saveFile() {
    parseCurrent(); // pull new data into the object
    // generate the file
    var code = '';
    for (var k in splitfile) {
        code += '//{{' + k + '}}\n';
        code += splitfile[k] + '\n';
    }

    fs.writeFile(filepath, code, function (err) {
        if (err) {
            notify(err, 'bad');
        } else {
            notify('File Saved', 'good');
        }
    });
}

function reparse() {
    // get current row
    var pos = editor.getCursorPosition();
    var firstVisibleRow = editor.getFirstVisibleRow();
    parseCurrent();
    // generate the file
    var code = '';
    for (var a in splitfile) {
        code += '//{{' + a + '}}\n';
        code += splitfile[a] + '\n';
    }

    // remake file
    var splitcode = code.split(/\/\/{{([0-9a-zA-z_\-\s]*)}}+/);
    clearSplitfile();
    for (var i = 1; i < splitcode.length; i = i + 2) {
        // we remove the first and last new line in the code after split
        splitfile[splitcode[i]] = splitcode[i + 1].replace('\n', '').replace(/\n$/, '');
        ;

    }

    // make file menu
    var key = $('.file-selected').attr('data-id');
    var str = '<ul>';
    str += '<li id="allfilesbutton" class="filelink';
    if (key == 'SHOWALLFILE') {
        str += ' file-selected'
    }
    str += '" data-id="SHOWALLFILE">SHOW ALL</li>';
    for (var k in splitfile) {
        str += '<li class="filelink';
        console.log('Key: ' + key + '   k: ' + k);
        if (key == k) {
            str += ' file-selected'
        }
        str += '" data-id="' + k + '">' + k + '</li>';
    }
    str += '</ul>';
    $('#file-breakout').html(str);
    editFile(key);
    setupFilelink();
    // go to last postion
    editor.moveCursorToPosition(pos);
    editor.scrollToRow(firstVisibleRow);
}

function insertVfTag() {
    var pos = editor.getCursorPosition();
    var firstVisibleRow = editor.getFirstVisibleRow();
    editor.session.insert(pos, '//{{}}');
    pos.column = pos.column + 4;
    editor.moveCursorToPosition(pos);
    editor.scrollToRow(firstVisibleRow);
}
/************* Functions ***************/

function clearSplitfile() {
    for (var k in splitfile) {
        delete splitfile[k];
    }
    splitfile = {};
}