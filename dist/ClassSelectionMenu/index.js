import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useState, memo } from "react";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as muiColors from "@mui/material/colors";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles } from "@mui/styles";
import colors from "../colors";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import BallotIcon from "@mui/icons-material/Ballot";
import capitalize from "lodash/capitalize";
import classnames from "classnames";
import { grey } from "@mui/material/colors";
import TrashIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import UnlockIcon from "@mui/icons-material/LockOpen";
import VisibleIcon from "@mui/icons-material/Visibility";
import VisibleOffIcon from "@mui/icons-material/VisibilityOff";
import ReorderIcon from "@mui/icons-material/SwapVert";
import PieChartIcon from "@mui/icons-material/PieChart";
import setInLocalStorage from "./../utils/set-in-local-storage";
import getFromLocalStorage from "./../utils/get-from-local-storage";
import styles from "../RegionSelectorSidebarBox/styles";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return styles;
});

// RFAVAS
var classShortcuts = {
  /*
    0: '1',
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: '6',
    6: '7',
    7: '8',
    8: '9',
    9: '0',
    10: 'q',
    11: 'w',
    12: 'e',
    13: 'r',
    14: 't',
    15: 'y',
    16: 'u',
    17: 'i',
    18: 'o',
    19: 'p',
  */
};
var HeaderSep = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    borderTop: "1px solid ".concat(grey[200]),
    marginTop: 2,
    marginBottom: 2
  };
});
var RowLayout = function RowLayout(_ref2) {
  var header = _ref2.header,
    highlighted = _ref2.highlighted,
    order = _ref2.order,
    classification = _ref2.classification,
    area = _ref2.area,
    tags = _ref2.tags,
    trash = _ref2.trash,
    lock = _ref2.lock,
    visible = _ref2.visible,
    onClick = _ref2.onClick;
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
var Chip = function Chip(_ref3) {
  var color = _ref3.color,
    text = _ref3.text;
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
var RowHeader = function RowHeader(_ref4) {
  var regions = _ref4.regions,
    onChangeRegion = _ref4.onChangeRegion,
    onDeleteRegion = _ref4.onDeleteRegion;
  var visible = regions.find(function (r) {
    return r.visible === false;
  }) == null;
  var locked = regions.find(function (r) {
    return r.locked === false;
  }) == null;
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
    }, "Name"),
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
          return onChangeRegion(_objectSpread({}, r, {
            locked: false
          }));
        });
      },
      className: "icon"
    }) : /*#__PURE__*/React.createElement(UnlockIcon, {
      onClick: function onClick() {
        return regions.forEach(function (r) {
          return onChangeRegion(_objectSpread({}, r, {
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
        var hideCls = getFromLocalStorage("hideCls") || {};
        hideCls['*'] = true;
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: false
          }));
        });
        setInLocalStorage("hideCls", hideCls);
      },
      className: "icon"
    }) : /*#__PURE__*/React.createElement(VisibleOffIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: true
          }));
        });
        setInLocalStorage("hideCls", {});
      },
      className: "icon"
    }))
  });
};
var MemoRowHeader = memo(RowHeader);
var Row = function Row(_ref5) {
  var highlighted = _ref5.highlighted,
    onSelectCls = _ref5.onSelectCls,
    onDeleteRegion = _ref5.onDeleteRegion,
    onChangeRegion = _ref5.onChangeRegion,
    color = _ref5.color,
    cls = _ref5.cls,
    index = _ref5.index,
    regions = _ref5.regions;
  var visible = regions.every(function (r) {
    return r.visible === true;
  });
  var locked = regions.every(function (r) {
    return r.locked === true;
  });
  return /*#__PURE__*/React.createElement(RowLayout, {
    header: false,
    highlighted: highlighted,
    onClick: function onClick() {
      onSelectCls(cls);
    },
    order: "".concat(index + 1),
    classification: /*#__PURE__*/React.createElement(Chip, {
      text: cls || "",
      color: color || "#ddd"
    }),
    area: "",
    trash: /*#__PURE__*/React.createElement(TrashIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          return onDeleteRegion(r);
        });
      },
      className: "icon2"
    }),
    lock: locked ? /*#__PURE__*/React.createElement(LockIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            locked: false
          }));
        });
      },
      className: "icon2"
    }) : /*#__PURE__*/React.createElement(UnlockIcon, {
      onClick: function onClick() {
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            locked: true
          }));
        });
      },
      className: "icon2"
    }),
    visible: visible ? /*#__PURE__*/React.createElement(VisibleIcon, {
      onClick: function onClick() {
        var hideCls = getFromLocalStorage("hideCls") || {};
        hideCls[cls] = true;
        setInLocalStorage("hideCls", hideCls);
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: false
          }));
        });
      },
      className: "icon2"
    }) : /*#__PURE__*/React.createElement(VisibleOffIcon, {
      onClick: function onClick() {
        var hideCls = getFromLocalStorage("hideCls") || {};
        if (hideCls['*'] === true) {
          hideCls[cls] = false;
        } else {
          delete hideCls[cls];
        }
        setInLocalStorage("hideCls", hideCls);
        regions.forEach(function (r) {
          onChangeRegion(_objectSpread({}, r, {
            visible: true
          }));
        });
      },
      className: "icon2"
    })
  });
};
var MemoRow = memo(Row, function (prevProps, nextProps) {
  return prevProps.highlighted === nextProps.highlighted && prevProps.id === nextProps.id && prevProps.index === nextProps.index && prevProps.cls === nextProps.cls && prevProps.color === nextProps.color && prevProps.regions === nextProps.regions;
});
export var ClassSelectionMenu = function ClassSelectionMenu(_ref6) {
  var regions = _ref6.regions,
    selectedCls = _ref6.selectedCls,
    regionClsList = _ref6.regionClsList,
    onSelectCls = _ref6.onSelectCls,
    onDeleteRegion = _ref6.onDeleteRegion,
    onChangeRegion = _ref6.onChangeRegion,
    onSelectRegion = _ref6.onSelectRegion;
  var classes = useStyles();
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    classifications = _useState4[0],
    setClassifications = _useState4[1];
  useEffect(function () {
    var classifications = {};
    regions.forEach(function (e) {
      var cls = classifications[e.cls] = classifications[e.cls] || {
        id: e.cls,
        cls: e.cls,
        color: e.color,
        regions: []
      };
      cls.regions.push(e);
    });
    setClassifications(Object.values(classifications));

    /*
    const keyMapping = {}
    for (let i = 0; i < regionClsList.length; i++) {
      if (classShortcuts[i] != null) {
        keyMapping[classShortcuts[i]] = () => onSelectCls(regionClsList[i])
      }
    }
    const onKeyDown = (e) => {
      if (keyMapping[e.key]) {
        keyMapping[e.key]()
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    */
  }, [regions, regionClsList, selectedCls]);
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(SidebarBoxContainer, {
    title: "Classes" // RFAVAS Classifications -> Classes
    ,
    subTitle: "",
    icon: /*#__PURE__*/React.createElement(BallotIcon, {
      style: {
        color: muiColors.grey[700]
      }
    }),
    expandedByDefault: true
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.container
  }, /*#__PURE__*/React.createElement(MemoRowHeader, {
    regions: regions,
    onChangeRegion: onChangeRegion,
    onDeleteRegion: onDeleteRegion
  }), /*#__PURE__*/React.createElement(HeaderSep, null), classifications.map(function (c, i) {
    return /*#__PURE__*/React.createElement(MemoRow, {
      index: i,
      key: c.id,
      cls: c.cls,
      color: c.color,
      regions: c.regions,
      allRegions: regions,
      onSelectCls: onSelectCls,
      onDeleteRegion: onDeleteRegion,
      onChangeRegion: onChangeRegion
    });
  }))));
};
export default ClassSelectionMenu;