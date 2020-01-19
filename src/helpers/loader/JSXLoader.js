import React from 'react';
import { cloneDeep, isEmpty } from 'lodash-es';
import * as Loader from './index';

export default {
  name: 'jsx',
  translate: (entity, ctx) => {
    if (entity.hasOwnProperty('$$_type') && entity.hasOwnProperty('$$_body')) {
      const { $$_type, $$_body } = cloneDeep(entity);
      if ($$_type === 'jsx') {
        if (!isEmpty($$_body)) {
          return $$_body.map((item, index) => {
            if (!isEmpty(item['$$_body'])) {
              return Loader[item['$$_type']].translate(item);
            }
          });
        }
      }
    }
  },
};
