
/* IMPORT */

import * as _ from 'lodash';
import Config from './config';

/* CONSTS */

const Consts = {

  get () {

    return {
      languageId: 'markdown',
      symbols: {
        bullet: Config.getKey ( 'symbols.bullet' )
      },
      regexes: {
        line:       /^(\s*)([*+-]?\s*)(.*)$/,
        todoBox:    /^(\s*)([*+-]\s+\[ \]\s*)(.*)$/,
        todoDone:   /^(\s*)([*+-]\s+\[[x]\]\s*)(.*)$/,
        todoNow:    /^(\s*)([*+-]\s+\[[!]\]\s*)(.*)$/,
        todoSoon:   /^(\s*)([*+-]\s+\[[\\?]\]\s*)(.*)$/,
        todoWait:   /^(\s*)([*+-]\s+\[[\\^]\]\s*)(.*)$/,
        todoDel:    /^(\s*)([*+-]\s+\[[-]\]\s*)(.*)$/,
        todoMove:   /^(\s*)([*+-]\s+\[[>]\]\s*)(.*)$/,
        todoPart:   /^(\s*)([*+-]\s+\[[+]\]\s*)(.*)$/,
        todoAny:    /^(\s*)([*+-]\s+\[[x!\\?\\^>+-]\]\s*)(.*)$/,
      }
    };

  },

  update () {

    _.merge ( Consts, Consts.get () );

  }

};

Consts.update ();

type IConsts = typeof Consts & ReturnType<typeof Consts.get>;

/* EXPORT */

export default Consts as IConsts;
