import { isEmpty } from 'lodash-es';
import React from 'react';
import { abortFetch, newAbortCtrl } from '@/helpers/request';

export const createDetail = (opt = {}) => {
  const { modelName } = opt;
  if (isEmpty(modelName)) {
    console.error('modelName is required in createDetail ');
    return null;
  }

  return (Comp) => {
    class WithDetail extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        this.abortCtrls = {};
      }

      componentDidMount() {
        const { match } = this.props;
        if (match && match.isExact) {
          this.showDetail();
        }
        this.fetchDetail();
      }

      componentWillUnmount() {
        for (let k in this.abortCtrls) {
          abortFetch(this.abortCtrls[k]);
        }
        if(window.AUTO_CLOSE) {
          window.close();
        }
      }

      fetchDetail() {
        const { dispatch, match, id } = this.props;
        const fID = id > 0 ? id : (match ? match.params.id : 0);
        this.abortCtrls.detail = newAbortCtrl();

        return dispatch({
          type: `${modelName}/fetchDetail`,
          payload: {
            id: fID,
            signal: this.abortCtrls.detail.signal,
          },
        });
      }

      /**
       * 中止“详情”请求
       */
      abortDetail() {
        abortFetch(this.abortCtrls.detail);
      }

      /**
       * 中止“保存”请求
       */
      abortSave() {
        abortFetch(this.abortCtrls.save);
      }

      saveDetail(values, hideDetail = true) {
        const { dispatch } = this.props;
        this.abortCtrls.save = newAbortCtrl();
        return dispatch({
          type: `${modelName}/saveDetail`,
          payload: {
            ...values,
            signal: this.abortCtrls.save.signal,
          },
        }).then((response) => {
          if (response && 200 === response.status && hideDetail) {
            this.hideDetail();
          }
          return response;
        });
      }

      onRef(refKey, ref) {
        const tmpO = {};
        tmpO[refKey] = ref;
        this.setState({ ...tmpO });
      };

      showDetail() {
        const { dispatch } = this.props;
        dispatch({
          type: `${modelName}/showDetail`,
          payload: {},
        });
      }

      hideDetail() {
        const { dispatch, match, location } = this.props;
        const animated = location.query ? location.query.animated : '';

        dispatch({
          type: `${modelName}/hideDetail`,
          payload: {
            isPage: !isEmpty(match),
            animated: 'none' !== animated,
          },
        });
      };

      render() {
        const compProps = {
          ...this.props,
          ...this.state,
          onRef: this.onRef.bind(this),
          hideDetail: this.hideDetail.bind(this),
          fetchDetail: this.fetchDetail.bind(this),
          saveDetail: this.saveDetail.bind(this),
          abortDetail: this.abortDetail.bind(this),
          abortSave: this.abortSave.bind(this),
        };
        return (
          <Comp {...compProps} />
        );
      }
    }

    WithDetail.displayName = `WithDetail(${Comp.displayName || Comp.name})`;
    return WithDetail;
  };
};
