
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Consts from './consts';
import Editor from './editor';

/* TOGGLE RULES */

async function toggleRules ( ...rules ) {

  const textEditor = vscode.window.activeTextEditor;

  if ( !Editor.isSupported ( textEditor ) ) return;

  const textDocument = textEditor.document,
        lines = _.uniq ( textEditor.selections.map ( selection => textDocument.lineAt ( selection.active.line ) ) );

  if ( !lines.length ) return;

  const edits = [];

  lines.forEach ( line => {

    rules.find ( ([ regex, replacement ]) => {

      if ( !regex.test ( line.text ) ) return false;

      const nextText = line.text.replace ( regex, replacement );

      edits.push ( ..._.filter ( _.flattenDeep ( lines.map ( line => Editor.edits.makeDiff ( line.text, nextText, line.lineNumber ) ) ) ) );

      return true;

    });

  });

  if ( !edits.length ) return;

  await Editor.edits.apply ( textEditor, edits );

}

/* COMMANDS */

function toggleTodo () {

  const {bullet} = Consts.symbols,
        {line, todoBox, todoAny} = Consts.regexes;

  toggleRules (
    [todoBox, '$1$3'],
    [todoAny, `$1${bullet} [ ] $3`],
    [line,    `$1${bullet} [ ] $3`]
  );

}

function toggleDone () {

  const {bullet} = Consts.symbols,
        {line, todoBox, todoDone, todoNow, todoSoon, todoWait, todoDel, todoMove, todoPart} = Consts.regexes;

  toggleRules (
    [todoBox,   `$1${bullet} [x] $3`],
    [todoDone,  `$1${bullet} [!] $3`],
    [todoNow,   `$1${bullet} [?] $3`],
    [todoSoon,  `$1${bullet} [^] $3`],
    [todoWait,  `$1${bullet} [-] $3`],
    [todoDel,   `$1${bullet} [>] $3`],
    [todoMove,  `$1${bullet} [+] $3`],
    [todoPart,  `$1${bullet} [ ] $3`],

    [line,      `$1${bullet} [x] $3`],
  );

}

function toggleDoneBack () {

  const {bullet} = Consts.symbols,
        {line, todoBox, todoDone, todoNow, todoSoon, todoWait, todoDel, todoMove, todoPart} = Consts.regexes;

  toggleRules (
    [todoPart,  `$1${bullet} [>] $3`],
    [todoMove,  `$1${bullet} [-] $3`],
    [todoDel,   `$1${bullet} [^] $3`],
    [todoWait,  `$1${bullet} [?] $3`],
    [todoSoon,  `$1${bullet} [!] $3`],
    [todoNow,   `$1${bullet} [x] $3`],
    [todoDone,  `$1${bullet} [ ] $3`],
    [todoBox,   `$1${bullet} [+] $3`],
  );

}

/* EXPORT */

export {toggleTodo, toggleDone, toggleDoneBack};
