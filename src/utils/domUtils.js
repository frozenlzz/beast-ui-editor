import { isEmpty, isString } from 'lodash-es';

/**
 * 获取 dom 节点 $container 的 tagName = childName 的子节点
 * @param $container DomElement
 * @param childTagName String 子节点的 tagName
 * @returns {null}
 */
export const getChildDomByName = ($container, childTagName) => {
  let reDom = null;
  if ($container && !isEmpty($container.childNodes) && isString(childTagName)) {
    for (let i = 0, len = $container.childNodes.length; i < len; i++) {
      let chNode = $container.childNodes[i];
      if (chNode && !isEmpty(chNode.childNodes)) {
        reDom = getChildDomByName(chNode, childTagName);
      } else if (chNode.tagName.toLowerCase() === childTagName.toLowerCase()) {
        reDom = chNode;
      }
      if(reDom) break;
    }
  }
  return reDom;
};
