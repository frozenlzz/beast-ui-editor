import React, { Component } from 'react';
import { Card, Checkbox, Col, Form, Input, Row, Skeleton } from 'antd';
import { createForm } from '/common/components/HocCRUD';
import { find, isEmpty, map, isFunction, isArray, findIndex } from 'lodash';
import styles from './index.less';
import { fetchSecList } from '@/pages/Role/service';
import { failHandler } from '@/helpers/request';
import { isObjectValEqual } from '/common/utils/utils';

const CheckboxGroup = Checkbox.Group;
let secModules = null; // 权限模块

@Form.create()
@createForm()
export default class DetailForm extends Component {

  state = {
    loading: false,
  };

  groupRef = {};

  componentDidMount() {
    this.setState({ loading: true });
    fetchSecList().then((rsp) => {
      if (rsp && 200 === rsp.status) {
        secModules = rsp.data;
      }
      this.setState({ loading: false });
      return rsp;
    }).then(failHandler);
  }

  getAjaxData() {
    const detail = this.props.compData || {};
    return new Promise((resolve, reject) => {
      this.props.form.validateFieldsAndScroll((errors, fieldsValue) => {
        // console.log('fieldsValue', fieldsValue);
        if (isEmpty(errors)) {
          const values = {
            ...fieldsValue,
          };
          if (detail.id > 0) {
            values.id = detail.id;
          }

          // 获取权限模块
          values.resources = [];
          // console.log('>>> this.groupRef', this.groupRef);
          map(this.groupRef, (ref) => {
            if (ref && isFunction(ref.getAjaxData)) {
              const chList = ref.getAjaxData().map(v => ({
                id: v.id,
              }));
              values.resources = values.resources.concat(chList);
            }
          });
          // console.log('>>> values', values);
          resolve(values);
        } else {
          reject(errors);
        }
      });
    });
  }

  getFields(formFields) {
    const formProps = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    const colSpan = 12;
    return this.props.getFields(formFields, colSpan, formProps);
  }

  render() {
    const detail = this.props.compData || {};
    const formFields = [
      {
        label: '角色编码',
        fieldName: 'code',
        options: {
          initialValue: detail.code,
          rules: [{
            required: true,
            message: '请输入角色编码',
          }],
        },
        comp: <Input/>,
      },
      {
        label: '角色名称',
        fieldName: 'name',
        options: {
          initialValue: detail.name,
          rules: [{
            required: true,
            message: '请输入角色名称',
          }],
        },
        comp: <Input/>,
      },
    ];
    const cardStyle = { marginBottom: '16px' };
    let secInd = 0;

    return (
      <>
        <Card style={cardStyle} bodyStyle={{ padding: '16px 16px 0' }}
              type='inner' title={'基础信息'}>
          <Form layout="horizontal">
            <Row gutter={16}>
              {this.getFields(formFields)}
            </Row>
          </Form>
        </Card>
        <Card style={cardStyle}
              bodyStyle={{ padding: '16px 16px 10px' }}
              type='inner'
              title={'权限设置'}>
          {
            this.state.loading ? (
              <Skeleton active/>
            ) : (
              map(secModules, (v, k) => {
                let key = `${k}_${secInd}`;
                secInd++;
                return (
                  <ModuleGroup key={`${k}_${secInd++}`}
                               compData={{
                                 name: k,
                                 list: v.filter(vv => (vv && !isEmpty(vv.actionDesc))),
                               }}
                               defaultCheckList={detail.resources}
                               onRef={(ref) => {
                                 this.groupRef[key] = ref;
                               }}
                  />
                );
              })
            )
          }

        </Card>
      </>
    );
  }
}

class ModuleGroup extends Component {

  static defaultProps = {
    defaultCheckList: [],
    compData: {
      name: '', list: [],
    },
    // onChange: null, // Function 所选项有改变之后的回调; (checkedList) =>{}
  };

  constructor(props) {
    super(props);
    this.state = this._getStateData(props);
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isObjectValEqual(this.props, prevProps)) {
      this.setState(this._getStateData(this.props));
    }
  }

  getAjaxData() {
    return this.state.checkedList;
  }

  _getStateData(props) {
    const { defaultCheckList, compData } = props;
    const list = compData && compData.list ? compData.list : [];
    const checkedList = this.filterList(defaultCheckList, list);
    const checkAll = !isEmpty(checkedList) && checkedList.length === list.length;
    return {
      checkedList,
      indeterminate: !checkAll && !isEmpty(checkedList),
      checkAll,
    };
  }

  filterList(origList, plainOptions) {
    const list = [];
    isArray(origList) && origList.forEach(v => {
      if (v && -1 !== findIndex(plainOptions, o => (o && o.id === v.id))) {
        list.push(v);
      }
    });
    return list;
  }

  onChange = checkedList => {

    const plainOptions = this.props.compData.list;
    const chList = checkedList.map(v => (find(plainOptions, optItem => (v === optItem.id)))).filter(v => (v && !isEmpty(v.actionDesc)));
    this.setState({
      checkedList: chList,
      indeterminate: !!chList.length && chList.length < plainOptions.length,
      checkAll: chList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    const plainOptions = this.props.compData.list;
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    const { compData } = this.props;
    if (isEmpty(compData.list)) return null;

    return (
      <Row justify="center" gutter={24} className={styles.author}>
        <Col span={4} className={styles.authorLabel}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {compData.name}
          </Checkbox>
        </Col>
        <Col span={20} className={styles.authorGroup}>
          <CheckboxGroup className={styles.checkGroup}
                         value={this.state.checkedList.map(v => (v.id))}
                         onChange={this.onChange}
          >
            <Row>
              {
                map(compData.list, (vv) => {
                  return (
                    !isEmpty(vv.actionDesc) ? (
                      <Col key={vv.id} span={6} className={styles.authorItem}>
                        <Checkbox value={vv.id}>{vv.actionDesc}</Checkbox>
                      </Col>
                    ) : null
                  );
                })
              }
            </Row>
          </CheckboxGroup>
        </Col>
      </Row>
    );
  }
}
