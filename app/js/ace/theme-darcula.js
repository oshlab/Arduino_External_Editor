/**
 * Created by jaret on 12/3/2016.
 */
ace.define("ace/theme/darcula",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-darcula";
    exports.cssText = ".ace-darcula .ace_gutter {\
background: #3b3b3b;\
color: rgb(153,153,153)\
}\
.ace-darcula .ace_print-margin {\
width: 1px;\
background: #3b3b3b\
}\
.ace-darcula {\
background-color: #323232;\
color: #FFFFFF\
}\
.ace-darcula .ace_cursor {\
color: #91FF00\
}\
.ace-darcula .ace_marker-layer .ace_selection {\
background: rgba(90, 100, 126, 0.88)\
}\
.ace-darcula.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #323232;\
}\
.ace-darcula .ace_marker-layer .ace_step {\
background: rgb(102, 82, 0)\
}\
.ace-darcula .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #404040\
}\
.ace-darcula .ace_marker-layer .ace_active-line {\
background: #353637\
}\
.ace-darcula .ace_gutter-active-line {\
background-color: #353637\
}\
.ace-darcula .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(90, 100, 126, 0.88)\
}\
.ace-darcula .ace_invisible {\
color: #404040\
}\
.ace-darcula .ace_keyword,\
.ace-darcula .ace_meta {\
color: #CC7833\
}\
.ace-darcula .ace_constant,\
.ace-darcula .ace_constant.ace_character,\
.ace-darcula .ace_constant.ace_character.ace_escape,\
.ace-darcula .ace_constant.ace_other,\
.ace-darcula .ace_support.ace_constant {\
color: #6C99BB\
}\
.ace-darcula .ace_invalid {\
color: #FFFFFF;\
background-color: #FF0000\
}\
.ace-darcula .ace_fold {\
background-color: #CC7833;\
border-color: #FFFFFF\
}\
.ace-darcula .ace_support.ace_function {\
color: #ffc66d\
}\
.ace-darcula .ace_variable.ace_parameter {\
font-style: italic\
}\
.ace-darcula .ace_string {\
color: #6a8759\
}\
\.ace-darcula .ace_storage {\
color: #cc7832\
}\
.ace-darcula .ace_string.ace_regexp {\
color: #CCCC33\
}\
.ace-darcula .ace_comment {\
font-style: italic;\
color: #808080\
}\
.ace-darcula .ace_meta.ace_tag {\
color: #FFE5BB\
}\
.ace-darcula .ace_entity.ace_name {\
color: #FFC66D\
}\
.ace-darcula .ace_collab.ace_user1 {\
color: #323232;\
background-color: #FFF980\
}\
.ace-darcula .ace_identifier, .ace-darcula .ace_paren{\
color:#a9b7c6;\
}\
.ace-darcula .ace_support, .ace-darcula .ace_function, .ace-darcula .ace_C99, .ace-darcula .ace_c{\
color:#ffc66d;\
}\
.ace-darcula .ace_punctuation{\
color:#cc7832;\
}\
.ace-darcula .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMwMjLyZYiPj/8PAAreAwAI1+g0AAAAAElFTkSuQmCC) right repeat-y\
}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
