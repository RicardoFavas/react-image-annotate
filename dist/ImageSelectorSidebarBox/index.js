import React, { memo } from "react";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SidebarBoxContainer from "../SidebarBoxContainer";
import CollectionsIcon from "@mui/icons-material/Collections";
import { grey } from "@mui/material/colors";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import isEqual from "lodash/isEqual";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return {
    img: {
      width: 40,
      height: 40,
      borderRadius: 8
    }
  };
});
export var ImageSelectorSidebarBox = function ImageSelectorSidebarBox(_ref) {
  var images = _ref.images,
      onSelect = _ref.onSelect;
  var classes = useStyles();
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/React.createElement(SidebarBoxContainer, {
    title: "Images",
    subTitle: "(".concat(images.length, ")"),
    icon: /*#__PURE__*/React.createElement(CollectionsIcon, {
      style: {
        color: grey[700]
      }
    })
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(List, null, images.map(function (img, i) {
    return /*#__PURE__*/React.createElement(ListItem, {
      button: true,
      onClick: function onClick() {
        return onSelect(img);
      },
      dense: true,
      key: i
    }, /*#__PURE__*/React.createElement("img", {
      className: classes.img,
      src: img.src
    }), /*#__PURE__*/React.createElement(ListItemText, {
      primary: img.name,
      secondary: "".concat((img.regions || []).length, " Labels")
    }));
  })))));
};

var mapUsedImageProps = function mapUsedImageProps(a) {
  return [a.name, (a.regions || []).length, a.src];
};

export default memo(ImageSelectorSidebarBox, function (prevProps, nextProps) {
  return isEqual(prevProps.images.map(mapUsedImageProps), nextProps.images.map(mapUsedImageProps));
});