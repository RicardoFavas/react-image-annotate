import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FaMask as MaskIcon } from "react-icons/fa";
import { MdOutlineDraw as AreaIcon } from "react-icons/md";
import { PiCursorBold as SelectIcon } from "react-icons/pi";
import { PiHandBold as PanIcon } from "react-icons/pi";
import { FaGripLines as ExpandingLineIcon } from "react-icons/fa";
import { PiTagBold as TagIcon } from "react-icons/pi";
import { PiMagnifyingGlassBold as ZoomIcon } from "react-icons/pi";
import { PiPolygonBold as PolygonIcon } from "react-icons/pi";
import { PiLineSegmentBold as LineIcon } from "react-icons/pi";
import { PiBoundingBoxBold as RectangleIcon } from "react-icons/pi";
import { PiDiamondBold as PointIcon } from "react-icons/pi";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
var faStyle = {
  width: 16,
  height: 16,
  marginTop: 4,
  marginBottom: 4
};
export var iconDictionary = {
  select: function select() {
    return /*#__PURE__*/React.createElement(SelectIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  pan: function pan() {
    return /*#__PURE__*/React.createElement(PanIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  zoom: function zoom() {
    return /*#__PURE__*/React.createElement(ZoomIcon, {
      style: faStyle,
      size: "xs"
    });
  },
  "show-tags": function showTags() {
    return /*#__PURE__*/React.createElement(TagIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-point": function createPoint() {
    return /*#__PURE__*/React.createElement(PointIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-box": function createBox() {
    return /*#__PURE__*/React.createElement(RectangleIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-polygon": function createPolygon() {
    return /*#__PURE__*/React.createElement(PolygonIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-expanding-line": function createExpandingLine() {
    return /*#__PURE__*/React.createElement(ExpandingLineIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-line": function createLine() {
    return /*#__PURE__*/React.createElement(LineIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "show-mask": function showMask() {
    return /*#__PURE__*/React.createElement(MaskIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "modify-allowed-area": function modifyAllowedArea() {
    return /*#__PURE__*/React.createElement(AreaIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true
    });
  },
  "create-keypoints": AccessibilityNewIcon,
  window: FullscreenIcon
};
export default iconDictionary;