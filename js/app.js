/********* Setup ***************/

var fs = require('fs');
var path = require('path');
var filepath;
var filename;
var splitfile = {};

$(function () {
    // activate tooltips
    $('[data-toggle="tooltip"]').tooltip()
});

// open links in real browser
$('a[target=_blank]').on('click', function(){
    require('nw.gui').Shell.openExternal( this.href );
    return false;
});


/********* Buttons **************/
// open dialog
$('#open-btn').click(function () {
    var chooser = $('#fileDialog');
    chooser.unbind('change');
    chooser.change(function (evt) {
        filepath = $(this).val();
        filename = path.basename(filepath);
        console.log('Filename:' + filename);
        console.log('Filepath:' + filepath);
        $('#filename').html(filename);
        parseFile(filepath);
    });
    chooser.trigger('click');
});

$('#save-btn').click(function () {
    saveFile();
});

$('#reparse-btn').click(function(){
    reparse();
});

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
            if(splitcode.length > 1){
                for (var i = 1; i < splitcode.length; i = i + 2) {
                    // we remove the first and last new line in the code after split
                    splitfile[splitcode[i]] = splitcode[i + 1].replace('\n', '').replace(/\n$/, '');;

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

function setupFilelink(){
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
            c += splitfile[k]+'\n';
        }
    } else {
        console.log(splitfile);
        console.log('key is ' + key);
        console.log(splitfile[key]);
        c = splitfile[key];
        // increment line numbers
        for(var ke in splitfile){
            startLine++;
            if(ke != key){
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
        code += splitfile[k]+'\n';
    }

    fs.writeFile(filepath, code, function (err) {
        if (err) {
            notify(err, 'bad');
        } else {
            notify('File Saved', 'good');
        }
    });
}

function reparse(){
    // get current row
    var pos = editor.getCursorPosition();
    var firstVisibleRow = editor.getFirstVisibleRow();
    parseCurrent();
    // generate the file
    var code = '';
    for (var a in splitfile) {
        code += '//{{' + a + '}}\n';
        code += splitfile[a]+'\n';
    }

    // remake file
    var splitcode = code.split(/\/\/{{([0-9a-zA-z_\-\s]*)}}+/);
    clearSplitfile();
    for (var i = 1; i < splitcode.length; i = i + 2) {
        // we remove the first and last new line in the code after split
        splitfile[splitcode[i]] = splitcode[i + 1].replace('\n', '').replace(/\n$/, '');;

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
        console.log ('Key: '+ key+'   k: '+k);
        if(key == k){
            str += ' file-selected'
        }
        str+= '" data-id="' + k+'">' + k + '</li>';
    }
    str += '</ul>';
    $('#file-breakout').html(str);
    editFile(key);
    setupFilelink();
    // go to last postion
    editor.moveCursorToPosition(pos);
    editor.scrollToRow(firstVisibleRow);
}

function insertVfTag(){
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