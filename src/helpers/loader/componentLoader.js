import React from 'react';
import { cloneDeep, isEmpty } from 'lodash-es';
import * as JH_DOM from 'jh-lib';

export default {
  name: 'component',
  translate: (entity, ctx) => {
    if (entity.hasOwnProperty('$$_type') && entity.hasOwnProperty('$$_body')) {
      const { $$_type, $$_body } = cloneDeep(entity);
      if ($$_type === 'component') {
        if (!isEmpty($$_body)) {
          const newBody = cloneDeep($$_body);
          if (JH_DOM[newBody['DomType']]) {
            const Data = JH_DOM[newBody['DomType']];
            const newAttribute = newBody['attribute'] || {};
            const newStyle = newBody['style'] || {};
            return <Data {...newAttribute} style={{ ...newStyle }} key={newBody['key']}></Data>;
          }
        }
      }
    }
  },
};
