// @flow

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMask, faEdit } from "@fortawesome/free-solid-svg-icons"

import { FaMask as MaskIcon } from "react-icons/fa";
import { MdOutlineDraw as AreaIcon } from "react-icons/md";

import { PiCursorBold as SelectIcon } from "react-icons/pi";
import { PiHandBold as PanIcon } from "react-icons/pi";
import { FaGripLines as ExpandingLineIcon } from "react-icons/fa";

import { PiTagBold as TagIcon } from "react-icons/pi";
import { PiMagnifyingGlassBold as ZoomIcon } from "react-icons/pi";

import { PiPolygonBold as PolygonIcon } from "react-icons/pi";
import { PiLineSegmentBold as LineIcon} from "react-icons/pi";
import { PiBoundingBoxBold as RectangleIcon } from "react-icons/pi";
import { PiDiamondBold as PointIcon} from "react-icons/pi";


import FullscreenIcon from "@mui/icons-material/Fullscreen"
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew"

const faStyle = { width: 16, height: 16, marginTop: 4, marginBottom: 4 }

export const iconDictionary = {
  select: () => <SelectIcon style={faStyle} size="xs" fixedWidth/>,
  pan: () => <PanIcon style={faStyle} size="xs" fixedWidth />,
  zoom: () => <ZoomIcon style={faStyle} size="xs"/>,
  "show-tags": () => <TagIcon style={faStyle} size="xs" fixedWidth/>,
  "create-point": () => <PointIcon style={faStyle} size="xs" fixedWidth/>,
  "create-box": () => <RectangleIcon style={faStyle} size="xs" fixedWidth/>,
  "create-polygon": () => <PolygonIcon style={faStyle} size="xs" fixedWidth></PolygonIcon>,
  "create-expanding-line": () => <ExpandingLineIcon style={faStyle} size="xs" fixedWidth/>,
  "create-line": () => <LineIcon style={faStyle} size="xs" fixedWidth/>,
  "show-mask": () => <MaskIcon style={faStyle} size="xs" fixedWidth/>,
  "modify-allowed-area": () => <AreaIcon style={faStyle} size="xs" fixedWidth/>,
  "create-keypoints": AccessibilityNewIcon,
  window: FullscreenIcon,
}

export default iconDictionary
