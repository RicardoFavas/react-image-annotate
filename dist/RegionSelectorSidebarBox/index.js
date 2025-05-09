import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, useState, memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import RegionIcon from "@mui/icons-material/PictureInPicture";
import Grid from "@mui/material/Grid";
import ReorderIcon from "@mui/icons-material/SwapVert";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrashIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import UnlockIcon from "@mui/icons-material/LockOpen";
import VisibleIcon from "@mui/icons-material/Visibility";
import VisibleOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "./styles";
import classnames from "classnames";
import isEqual from "lodash/isEqual";
import Tooltip from "@mui/material/Tooltip";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return styles;
});
var HeaderSep = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    borderTop: "1px solid ".concat(grey[200]),
    marginTop: 2,
    marginBottom: 2
  };
});
var Chip = function Chip(_ref2) {
  var color = _ref2.color,
    text = _ref2.text;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement("span", {
    className: classes.chip
  }, /*#__PURE__*/React.createElement("div", {
    className: "color",
    style: {
      backgroundColor: color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "text"
  }, text));
};
var RowLayout = function RowLayout(_ref3) {
  var header = _ref3.header,
    highlighted = _ref3.highlighted,
    order = _ref3.order,
    classification = _ref3.classification,
    area = _ref3.area,
    tags = _ref3.tags,
    trash = _ref3.trash,
    lock = _ref3.lock,
    visible = _ref3.visible,
    onClick = _ref3.onClick;
  var classes = useStyles();
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    mouseOver = _useState2[0],
    changeMouseOver = _useState2[1];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: function onMouseEnter() {
      return changeMouseOver(true);
    },
    onMouseLeave: function onMouseLeave() {
      return changeMouseOver(false);
    },
    className: classnames(classes.row, {
      header: header,
      highlighted: highlighted
    })
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 4
    }
  }, order)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 6
  }, classification), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 6
    }
  }, area)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, trash), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, lock), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 1
  }, visible)));
};
var RowHeader = function RowHeader(_ref4) {
  var regions = _ref4.regions,
    onChangeRegion = _ref4.onChangeRegion,
    onDeleteRegion = _ref4.onDeleteRegion;
  // RFAVAS
  var visible = regions.every(function (r) {
    return r.visible === true;
  });
  var locked = regions.every(function (r) {
    return r.locked === true;
  });
  return /*#__PURE__*/React.createElement(RowLayout, {
    header: true,
    highlighted: false,
    order: /*#__PURE__*/React.createElement(ReorderIcon, {
      className: "icon"
    }),
    classification: /*#__PURE__*/React.createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, "Class"),
    area: /*#__PURE__*/React.createElement(PieChartIcon, {
      className: "icon"
    }),
    trash: /*#__PURE__*/React.createElement(TrashIcon, {
      className: "icon",
      onClick: function onClick() {
        return regions.forEach(function (r) {
          return onDeleteRegion(r);
        });
      }
    }),
    lock: /*#__PURE__*/React.createElement(Tooltip, {
      title: "Lock / Unlock (l)"
    }, locked === true ? /*#__PURE__*/React.createElement(LockIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            locked: false
          }));
        });
      },
      className: "icon"
    }) : /*#__PURE__*/React.createElement(UnlockIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            locked: true
          }));
        });
      },
      className: "icon"
    })),
    visible: /*#__PURE__*/React.createElement(Tooltip, {
      title: "Show / Hide (v)"
    }, visible ? /*#__PURE__*/React.createElement(VisibleIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: false
          }));
        });
      },
      className: "icon"
    }) : /*#__PURE__*/React.createElement(VisibleOffIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: true
          }));
        });
      },
      className: "icon"
    }))
  });
};
var MemoRowHeader = memo(RowHeader);
var Row = function Row(_ref5) {
  var r = _ref5.region,
    highlighted = _ref5.highlighted,
    onSelectRegion = _ref5.onSelectRegion,
    onDeleteRegion = _ref5.onDeleteRegion,
    onChangeRegion = _ref5.onChangeRegion,
    visible = _ref5.visible,
    locked = _ref5.locked,
    color = _ref5.color,
    cls = _ref5.cls,
    index = _ref5.index;
  return /*#__PURE__*/React.createElement(RowLayout, {
    header: false,
    highlighted: highlighted,
    onClick: function onClick() {
      return onSelectRegion(r);
    },
    order: "".concat(index + 1),
    classification: /*#__PURE__*/React.createElement(Chip, {
      text: cls || "",
      color: color || "#ddd"
    }),
    area: "",
    trash: /*#__PURE__*/React.createElement(TrashIcon, {
      onClick: function onClick() {
        return onDeleteRegion(r);
      },
      className: "icon2"
    }),
    lock: r.locked || r.locked === undefined ? /*#__PURE__*/React.createElement(LockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: false
        }));
      },
      className: "icon2"
    }) : /*#__PURE__*/React.createElement(UnlockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: true
        }));
      },
      className: "icon2"
    }),
    visible: r.visible || r.visible === undefined ? /*#__PURE__*/React.createElement(VisibleIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          visible: false
        }));
      },
      className: "icon2"
    }) : /*#__PURE__*/React.createElement(VisibleOffIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          visible: true
        }));
      },
      className: "icon2"
    })
  });
};
var MemoRow = memo(Row, function (prevProps, nextProps) {
  return prevProps.highlighted === nextProps.highlighted && prevProps.visible === nextProps.visible && prevProps.locked === nextProps.locked && prevProps.id === nextProps.id && prevProps.index === nextProps.index && prevProps.cls === nextProps.cls && prevProps.color === nextProps.color;
});
var emptyArr = [];
export var RegionSelectorSidebarBox = function RegionSelectorSidebarBox(_ref6) {
  var _ref6$regions = _ref6.regions,
    regions = _ref6$regions === void 0 ? emptyArr : _ref6$regions,
    onDeleteRegion = _ref6.onDeleteRegion,
    onChangeRegion = _ref6.onChangeRegion,
    onSelectRegion = _ref6.onSelectRegion;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(SidebarBoxContainer, {
    title: "Regions",
    subTitle: "",
    icon: /*#__PURE__*/React.createElement(RegionIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: true
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.container
  }, /*#__PURE__*/React.createElement(MemoRowHeader, {
    regions: regions,
    onChangeRegion: onChangeRegion,
    onDeleteRegion: onDeleteRegion
  }), /*#__PURE__*/React.createElement(HeaderSep, null), regions.map(function (r, i) {
    return /*#__PURE__*/React.createElement(MemoRow, Object.assign({
      key: r.id
    }, r, {
      region: r,
      index: i,
      onSelectRegion: onSelectRegion,
      onDeleteRegion: onDeleteRegion,
      onChangeRegion: onChangeRegion
    }));
  }))));
};
var mapUsedRegionProperties = function mapUsedRegionProperties(r) {
  return [r.id, r.color, r.locked, r.visible, r.highlighted];
};
export default memo(RegionSelectorSidebarBox, function (prevProps, nextProps) {
  return isEqual((prevProps.regions || emptyArr).map(mapUsedRegionProperties), (nextProps.regions || emptyArr).map(mapUsedRegionProperties));
});