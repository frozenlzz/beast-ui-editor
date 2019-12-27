import React from 'react';
import { map, omit } from 'lodash';
import { Col, Form } from 'antd';
import zh_cn from '@/locales/zh-CN';
import { formatMsgByCn, myFormatMessage } from '@/utils/localeUtils';


export const createForm = (opt = {}) => {
  let { config = {} } = opt;

  return (Comp) => {
    class WithDetailForm extends React.Component {

      constructor(props) {
        super(props);
      }

      getFields(formFields, colSpanDefault, formItemPropsDefault = {}) {
        const colSpan = colSpanDefault ? colSpanDefault :
          (formFields.length > (this.props.fromLineLeg ? this.props.fromLineLeg : 5) ? 12 : 24);
        const formItemProps = {
          labelCol: { span: 7 },
          wrapperCol: { span: 16 },
          ...formItemPropsDefault,
        };
        const { getFieldDecorator } = this.props.form;

        return map(formFields, (fItem, fKey) => {
          // 字段名的国际化处理
          let labelText = fItem.label;
          let fieldName = fItem.fieldName;
          if (fieldName) {
            let appText = formatMsgByCn(config.cn);
            let configFormatKey = `${config.modelName}.field.${fieldName}`;
            let globalFormatKey = `global.field.${fieldName}`;
            let formatLabel = '';
            if (zh_cn.hasOwnProperty(configFormatKey)) {
              formatLabel = myFormatMessage(configFormatKey, { name: appText });
            } else if (zh_cn.hasOwnProperty(globalFormatKey)) {
              formatLabel = myFormatMessage(globalFormatKey, { name: appText });
            } else if (labelText) {
              formatLabel = formatMsgByCn(labelText);
            }

            if (formatLabel) {
              labelText = formatLabel;
            }
          }

          return (
            <Col span={colSpan} key={fKey}>
              <Form.Item {...formItemProps} label={labelText} {...(fItem.itemProps || {})}>
                {getFieldDecorator(fItem.fieldName, fItem.options)(
                  fItem.comp,
                )}
              </Form.Item>
            </Col>
          );
        });
      }

      render() {
        const compProps = {
          ...omit(this.props, ['forwardRef']),
          getFields: this.getFields.bind(this),
        };
        return (
          <Comp ref={this.props.forwardRef} {...compProps} />
        );
      }
    }

    WithDetailForm.displayName = `WithDetailForm(${Comp.displayName || Comp.name})`;
    return React.forwardRef((props, ref) => {
      return <WithDetailForm {...props} forwardRef={ref}/>;
    });
  };
};
