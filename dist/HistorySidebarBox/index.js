import React, { setState, memo } from "react";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SidebarBoxContainer from "../SidebarBoxContainer";
import HistoryIcon from "@mui/icons-material/History";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import UndoIcon from "@mui/icons-material/Undo";
import moment from "moment";
import { grey } from "@mui/material/colors";
import isEqual from "lodash/isEqual";
import Box from "@mui/material/Box";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return {
    emptyText: {
      fontSize: 14,
      fontWeight: "bold",
      color: grey[500],
      textAlign: "center",
      padding: 20
    }
  };
});
var listItemTextStyle = {
  paddingLeft: 16
};
export var HistorySidebarBox = function HistorySidebarBox(_ref) {
  var history = _ref.history,
      onRestoreHistory = _ref.onRestoreHistory;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(SidebarBoxContainer, {
    title: "History",
    icon: /*#__PURE__*/React.createElement(HistoryIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: true
  }, /*#__PURE__*/React.createElement(List, null, history.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: classes.emptyText
  }, "No History Yet"), history.map(function (_ref2, i) {
    var name = _ref2.name,
        time = _ref2.time;
    return /*#__PURE__*/React.createElement(ListItem, {
      button: true,
      dense: true,
      key: i
    }, /*#__PURE__*/React.createElement(ListItemText, {
      style: listItemTextStyle,
      primary: name,
      secondary: moment(time).format("LT")
    }), i === 0 && /*#__PURE__*/React.createElement(ListItemSecondaryAction, {
      onClick: function onClick() {
        return onRestoreHistory();
      }
    }, /*#__PURE__*/React.createElement(IconButton, null, /*#__PURE__*/React.createElement(UndoIcon, null))));
  }))));
};
export default memo(HistorySidebarBox, function (prevProps, nextProps) {
  return isEqual(prevProps.history.map(function (a) {
    return [a.name, a.time];
  }), nextProps.history.map(function (a) {
    return [a.name, a.time];
  }));
});