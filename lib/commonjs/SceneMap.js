"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SceneMap;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class SceneComponent extends React.PureComponent {
  render() {
    const {
      component,
      ...rest
    } = this.props;
    return /*#__PURE__*/React.createElement(component, rest);
  }

}

function SceneMap(scenes) {
  return ({
    route,
    jumpTo,
    position
  }) => /*#__PURE__*/React.createElement(SceneComponent, {
    key: route.key,
    component: scenes[route.key],
    route: route,
    jumpTo: jumpTo,
    position: position
  });
}
//# sourceMappingURL=SceneMap.js.map