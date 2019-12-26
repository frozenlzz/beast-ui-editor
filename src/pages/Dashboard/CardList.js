import React, { Component } from 'react';
import router from 'umi/router'
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';
import Ellipsis from '/common/components/Ellipsis';
import styles from './CardList.less';


class CardList extends Component {

    constructor(props) {
        super(props);
        this.state = {list:[
            {id:1,title:'凭证',avatar:'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',description:'凭证又称会计证,指的是能够用来证明经济业务事项发生、明确经济责任并据以登记账簿、具有法律效力的书面证明。'},
            {id:2,title:'凭证',avatar:'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',description:'凭证又称会计证,指的是能够用来证明经济业务事项发生、明确经济责任并据以登记账簿、具有法律效力的书面证明。'},
        ]};
    }
    render(){
        const { list } = this.state;
        return (
            <div className={styles.cardList}>
                <List
                    rowKey="id"
                    loading={false}
                    grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                    dataSource={['', ...list]}
                    renderItem={item =>
                      item ? (
                            <List.Item key={item.id}>
                              <Card
                                   className={styles.card}
                                   actions={[<a>查看凭证</a>, <a>新增凭证</a>]}>
                                <Card.Meta
                                  avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                                  title={<a>{item.title}</a>}
                                  description={
                                  <Ellipsis className={styles.item} placement="topLeft" lines={3} title={item.description}>
                                      {item.description}
                                   </Ellipsis>}
                                />
                              </Card>
                            </List.Item>
                          ) : (
                            <List.Item style={{marginBottom:14}}>
                              <Button type="dashed" className={styles.newButton} onClick={() => {router.push('/accountingAdd?animated=none')}}>
                                <Icon type="plus" /> 新增凭证
                              </Button>
                            </List.Item>
                          )
                        }>

                </List>
            </div>
        );
    }
}

export default CardList;
