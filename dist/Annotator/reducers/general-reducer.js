import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import { moveRegion } from "../../ImageCanvas/region-tools.js";
import { getIn, setIn, updateIn } from "seamless-immutable";
import moment from "moment";
import isEqual from "lodash/isEqual";
import getActiveImage from "./get-active-image";
import { saveToHistory } from "./history-handler.js";
import colors from "../../colors";
import fixTwisted from "./fix-twisted";
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon";
import clamp from "clamp";
import getLandmarksWithTransform from "../../utils/get-landmarks-with-transform";
import setInLocalStorage from "../../utils/set-in-local-storage";
import { uuidv7 } from "uuidv7";
var getRandomId = function getRandomId() {
  return uuidv7();
};
export default (function (state, action) {
  if (state.allowedArea && state.selectedTool !== "modify-allowed-area" && ["MOUSE_DOWN", "MOUSE_UP", "MOUSE_MOVE"].includes(action.type)) {
    var aa = state.allowedArea;
    action.x = clamp(action.x, aa.x, aa.x + aa.w);
    action.y = clamp(action.y, aa.y, aa.y + aa.h);
  }
  if (action.type === "ON_CLS_ADDED" && action.cls && action.cls !== "") {
    var oldRegionClsList = state.regionClsList;
    var newState = _objectSpread({}, state, {
      regionClsList: oldRegionClsList.concat(action.cls)
    });
    return newState;
  }

  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - (state.lastMouseMoveCall || 0) < 16) return state;
    state = setIn(state, ["lastMouseMoveCall"], Date.now());
  }
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action);
  }
  var _getActiveImage = getActiveImage(state),
    currentImageIndex = _getActiveImage.currentImageIndex,
    pathToActiveImage = _getActiveImage.pathToActiveImage,
    activeImage = _getActiveImage.activeImage;
  var getRegionIndex = function getRegionIndex(region) {
    var regionId = typeof region === "string" || typeof region === "number" ? region : region.id;
    if (!activeImage) return null;
    var regionIndex = (activeImage.regions || []).findIndex(function (r) {
      return r.id === regionId;
    });
    return regionIndex === -1 ? null : regionIndex;
  };
  var getRegion = function getRegion(regionId) {
    if (!activeImage) return null;
    var regionIndex = getRegionIndex(regionId);
    if (regionIndex === null) return [null, null];
    var region = activeImage.regions[regionIndex];
    return [region, regionIndex];
  };
  var modifyRegion = function modifyRegion(regionId, obj) {
    var _getRegion = getRegion(regionId),
      _getRegion2 = _slicedToArray(_getRegion, 2),
      region = _getRegion2[0],
      regionIndex = _getRegion2[1];
    if (!region) return state;
    if (obj !== null) {
      return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", regionIndex]), _objectSpread({}, region, obj));
    } else {
      // delete region
      var regions = activeImage.regions;
      return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (regions || []).filter(function (r) {
        return r.id !== region.id;
      }));
    }
  };
  var unselectRegions = function unselectRegions(state) {
    if (!activeImage) return state;
    return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).map(function (r) {
      return _objectSpread({}, r, {
        highlighted: false
      });
    }));
  };
  var closeEditors = function closeEditors(state) {
    if (currentImageIndex === null) return state;
    return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).map(function (r) {
      return _objectSpread({}, r, {
        editingLabels: false
      });
    }));
  };
  var setNewImage = function setNewImage(img, index) {
    var _ref = typeof img === "object" ? img : {
        src: img
      },
      src = _ref.src,
      frameTime = _ref.frameTime;
    return setIn(setIn(state, ["selectedImage"], index), ["selectedImageFrameTime"], frameTime);
  };
  switch (action.type) {
    case "@@INIT":
      {
        return state;
      }
    case "SELECT_IMAGE":
      {
        return setNewImage(action.image, action.imageIndex);
      }
    case "SELECT_CLASSIFICATION":
      {
        return setIn(state, ["selectedCls"], action.cls);
      }
    case "CHANGE_REGION":
      {
        var regionIndex = getRegionIndex(action.region);
        if (regionIndex === null) return state;
        var oldRegion = activeImage.regions[regionIndex];
        if (oldRegion.cls !== action.region.cls) {
          state = saveToHistory(state, "Change Region Classification");
          var clsIndex = state.regionClsList.indexOf(action.region.cls);
          if (clsIndex !== -1) {
            setInLocalStorage("selectedCls", action.region.cls);
            state = setIn(state, ["selectedCls"], action.region.cls);
            action.region.color = colors[clsIndex % colors.length];
          }
        }
        if (!isEqual(oldRegion.tags, action.region.tags)) {
          state = saveToHistory(state, "Change Region Tags");
        }
        if (!isEqual(oldRegion.comment, action.region.comment)) {
          state = saveToHistory(state, "Change Region Comment");
        }
        var _newState = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", regionIndex]), action.region);
        if (typeof _newState.onChange === 'function') {
          _newState.onChange(_newState, action); // RFAVAS
        }

        return _newState;
      }
    case "CHANGE_IMAGE":
      {
        if (!activeImage) return state;
        var delta = action.delta;
        for (var _i = 0, _Object$keys = Object.keys(delta); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          if (key === "cls") saveToHistory(state, "Change Image Class");
          if (key === "tags") saveToHistory(state, "Change Image Tags");
          state = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), [key]), delta[key]);
        }
        return state;
      }
    case "SELECT_REGION":
      {
        var region = action.region;
        var _regionIndex = getRegionIndex(action.region);
        if (_regionIndex === null) return state;
        var regions = _toConsumableArray(activeImage.regions || []).map(function (r) {
          return _objectSpread({}, r, {
            highlighted: r.id === region.id,
            editingLabels: r.id === region.id
          });
        });
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), regions);
      }
    case "BEGIN_MOVE_POINT":
      {
        state = closeEditors(state);
        return setIn(state, ["mode"], {
          mode: "MOVE_REGION",
          regionId: action.point.id
        });
      }
    case "BEGIN_BOX_TRANSFORM":
      {
        var box = action.box,
          directions = action.directions;
        state = closeEditors(state);
        if (directions[0] === 0 && directions[1] === 0) {
          return setIn(state, ["mode"], {
            mode: "MOVE_REGION",
            regionId: box.id
          });
        } else {
          return setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            regionId: box.id,
            freedom: directions,
            original: {
              x: box.x,
              y: box.y,
              w: box.w,
              h: box.h
            }
          });
        }
      }
    case "BEGIN_MOVE_POLYGON_POINT":
      {
        var polygon = action.polygon,
          pointIndex = action.pointIndex;
        state = closeEditors(state);
        if (state.mode && state.mode.mode === "DRAW_POLYGON" && pointIndex === 0) {
          var _newState3 = setIn(modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false
          }), ["mode"], null);
          if (typeof _newState3.onChange === 'function') {
            _newState3.onChange(_newState3, action); // RFAVAS
          }

          return _newState3;
        } else {
          state = saveToHistory(state, "Move Polygon Point");
        }
        var _newState2 = setIn(state, ["mode"], {
          mode: "MOVE_POLYGON_POINT",
          regionId: polygon.id,
          pointIndex: pointIndex
        });
        if (typeof _newState2.onChange === 'function') {
          _newState2.onChange(_newState2, action); // RFAVAS
        }

        return _newState2;
      }
    // RF LINE
    case "BEGIN_MOVE_LINE_POINT":
      {
        var line = action.line,
          _pointIndex = action.pointIndex;
        state = closeEditors(state);
        if (state.mode && state.mode.mode === "DRAW_LINE" && _pointIndex === 0) {
          var _newState5 = setIn(modifyRegion(line, {
            points: line.points,
            open: false
          }), ["mode"], null);
          if (typeof _newState5.onChange === 'function') {
            _newState5.onChange(_newState5, action); // RFAVAS
          }

          return _newState5;
        } else {
          state = saveToHistory(state, "Move Line Point");
        }
        var _newState4 = setIn(state, ["mode"], {
          mode: "MOVE_LINE_POINT",
          regionId: line.id,
          pointIndex: _pointIndex
        });
        if (typeof _newState4.onChange === 'function') {
          _newState4.onChange(_newState4, action); // RFAVAS
        }

        return _newState4;
      }
    case "BEGIN_MOVE_LINE":
      {
        var _line = action.line;
        state = closeEditors(state);
        if (state.mode && state.mode.mode === "DRAW_LINE") {
          var _newState7 = setIn(modifyRegion(_line, {
            points: _line.points,
            open: false
          }), ["mode"], null);
          if (typeof _newState7.onChange === 'function') {
            _newState7.onChange(_newState7, action); // RFAVAS
          }

          return _newState7;
        } else {
          state = saveToHistory(state, "Move Line");
        }
        var _newState6 = setIn(state, ["mode"], {
          mode: "MOVE_LINE",
          regionId: _line.id
        });
        if (typeof _newState6.onChange === 'function') {
          _newState6.onChange(_newState6, action); // RFAVAS
        }

        return _newState6;
      }
    case "BEGIN_MOVE_KEYPOINT":
      {
        var _region = action.region,
          keypointId = action.keypointId;
        state = closeEditors(state);
        state = saveToHistory(state, "Move Keypoint");
        return setIn(state, ["mode"], {
          mode: "MOVE_KEYPOINT",
          regionId: _region.id,
          keypointId: keypointId
        });
      }
    case "ADD_POLYGON_POINT":
      {
        var _polygon = action.polygon,
          point = action.point,
          _pointIndex2 = action.pointIndex;
        var _regionIndex2 = getRegionIndex(_polygon);
        if (_regionIndex2 === null) return state;
        var points = _toConsumableArray(_polygon.points);
        points.splice(_pointIndex2, 0, point);
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex2]), _objectSpread({}, _polygon, {
          points: points
        }));
      }
    case "MOUSE_MOVE":
      {
        var x = action.x,
          y = action.y;
        if (!state.mode) return state;
        if (!activeImage) return state;
        var _state = state,
          mouseDownAt = _state.mouseDownAt;
        switch (state.mode.mode) {
          case "MOVE_POLYGON_POINT":
            {
              var _state$mode = state.mode,
                _pointIndex3 = _state$mode.pointIndex,
                regionId = _state$mode.regionId;
              var _regionIndex3 = getRegionIndex(regionId);
              if (_regionIndex3 === null) return state;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex3, "points", _pointIndex3]), [x, y]);
            }
          case "MOVE_LINE_POINT":
            {
              // RF LINE
              var _state$mode2 = state.mode,
                _pointIndex4 = _state$mode2.pointIndex,
                _regionId = _state$mode2.regionId;
              var _getRegion3 = getRegion(_regionId),
                _getRegion4 = _slicedToArray(_getRegion3, 2),
                _region2 = _getRegion4[0],
                _regionIndex4 = _getRegion4[1];
              if (_regionIndex4 === null) return state;
              var x1 = _region2.x1,
                x2 = _region2.x2,
                y1 = _region2.y1,
                y2 = _region2.y2;
              if (_pointIndex4 === 0) {
                x1 = x;
                y1 = y;
              } else if (_pointIndex4 === 1) {
                x2 = x;
                y2 = y;
              }
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex4]), _objectSpread({}, _region2, {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
              }));
            }
          case "MOVE_LINE":
            {
              // RF LINE
              var _regionId2 = state.mode.regionId;
              var _getRegion5 = getRegion(_regionId2),
                _getRegion6 = _slicedToArray(_getRegion5, 2),
                _region3 = _getRegion6[0],
                _regionIndex5 = _getRegion6[1];
              if (_regionIndex5 === null) return state;
              var _x = _region3.x1,
                _x2 = _region3.x2,
                _y = _region3.y1,
                _y2 = _region3.y2;
              var dx = x - (_x + _x2) / 2;
              var dy = y - (_y + _y2) / 2;
              _x += dx;
              _x2 += dx;
              _y += dy;
              _y2 += dy;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex5]), _objectSpread({}, _region3, {
                x1: _x,
                y1: _y,
                x2: _x2,
                y2: _y2
              }));
            }
          case "MOVE_KEYPOINT":
            {
              var _state$mode3 = state.mode,
                _keypointId = _state$mode3.keypointId,
                _regionId3 = _state$mode3.regionId;
              var _getRegion7 = getRegion(_regionId3),
                _getRegion8 = _slicedToArray(_getRegion7, 2),
                _region4 = _getRegion8[0],
                _regionIndex6 = _getRegion8[1];
              if (_regionIndex6 === null) return state;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex6, "points", _keypointId]), _objectSpread({}, _region4.points[_keypointId], {
                x: x,
                y: y
              }));
            }
          case "MOVE_REGION":
            {
              var _regionId4 = state.mode.regionId;
              if (_regionId4 === "$$allowed_area") {
                var _state2 = state,
                  _state2$allowedArea = _state2.allowedArea,
                  w = _state2$allowedArea.w,
                  h = _state2$allowedArea.h;
                return setIn(state, ["allowedArea"], {
                  x: x - w / 2,
                  y: y - h / 2,
                  w: w,
                  h: h
                });
              }
              var _regionIndex7 = getRegionIndex(_regionId4);
              if (_regionIndex7 === null) return state;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex7]), moveRegion(activeImage.regions[_regionIndex7], x, y));
            }
          case "RESIZE_BOX":
            {
              var _state$mode4 = state.mode,
                _regionId5 = _state$mode4.regionId,
                _state$mode4$freedom = _slicedToArray(_state$mode4.freedom, 2),
                xFree = _state$mode4$freedom[0],
                yFree = _state$mode4$freedom[1],
                _state$mode4$original = _state$mode4.original,
                ox = _state$mode4$original.x,
                oy = _state$mode4$original.y,
                ow = _state$mode4$original.w,
                oh = _state$mode4$original.h;
              var _dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox;
              var dw = xFree === 0 ? ow : xFree === -1 ? ow + (ox - _dx) : Math.max(0, ow + (x - ox - ow));
              var _dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy;
              var dh = yFree === 0 ? oh : yFree === -1 ? oh + (oy - _dy) : Math.max(0, oh + (y - oy - oh));

              // determine if we should switch the freedom
              if (dw <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree]);
              }
              if (dh <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1]);
              }
              if (_regionId5 === "$$allowed_area") {
                return setIn(state, ["allowedArea"], {
                  x: _dx,
                  w: dw,
                  y: _dy,
                  h: dh
                });
              }
              var _regionIndex8 = getRegionIndex(_regionId5);
              if (_regionIndex8 === null) return state;
              var _box = activeImage.regions[_regionIndex8];
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex8]), _objectSpread({}, _box, {
                x: _dx,
                w: dw,
                y: _dy,
                h: dh
              }));
            }
          case "RESIZE_KEYPOINTS":
            {
              var _state$mode5 = state.mode,
                _regionId6 = _state$mode5.regionId,
                landmarks = _state$mode5.landmarks,
                centerX = _state$mode5.centerX,
                centerY = _state$mode5.centerY;
              var distFromCenter = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
              var scale = distFromCenter / 0.15;
              return modifyRegion(_regionId6, {
                points: getLandmarksWithTransform({
                  landmarks: landmarks,
                  center: {
                    x: centerX,
                    y: centerY
                  },
                  scale: scale
                })
              });
            }
          case "DRAW_POLYGON":
            {
              var _regionId7 = state.mode.regionId;
              var _getRegion9 = getRegion(_regionId7),
                _getRegion10 = _slicedToArray(_getRegion9, 2),
                _region5 = _getRegion10[0],
                _regionIndex9 = _getRegion10[1];
              if (!_region5) return setIn(state, ["mode"], null);
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex9, "points", _region5.points.length - 1]), [x, y]);
            }
          case "DRAW_LINE":
            {
              var _regionId8 = state.mode.regionId;
              var _getRegion11 = getRegion(_regionId8),
                _getRegion12 = _slicedToArray(_getRegion11, 2),
                _region6 = _getRegion12[0],
                _regionIndex10 = _getRegion12[1];
              if (!_region6) return setIn(state, ["mode"], null);
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex10]), _objectSpread({}, _region6, {
                x2: x,
                y2: y
              }));
            }
          case "DRAW_EXPANDING_LINE":
            {
              var _regionId9 = state.mode.regionId;
              var _getRegion13 = getRegion(_regionId9),
                _getRegion14 = _slicedToArray(_getRegion13, 2),
                expandingLine = _getRegion14[0],
                _regionIndex11 = _getRegion14[1];
              if (!expandingLine) return state;
              var isMouseDown = Boolean(state.mouseDownAt);
              if (isMouseDown) {
                // If the mouse is down, set width/angle
                var lastPoint = expandingLine.points.slice(-1)[0];
                var mouseDistFromLastPoint = Math.sqrt(Math.pow(lastPoint.x - x, 2) + Math.pow(lastPoint.y - y, 2));
                if (mouseDistFromLastPoint < 0.002 && !lastPoint.width) return state;
                var _newState8 = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex11, "points"]), expandingLine.points.slice(0, -1).concat([_objectSpread({}, lastPoint, {
                  width: mouseDistFromLastPoint * 2,
                  angle: Math.atan2(lastPoint.x - x, lastPoint.y - y)
                })]));
                return _newState8;
              } else {
                // If mouse is up, move the next candidate point
                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex11]), _objectSpread({}, expandingLine, {
                  candidatePoint: {
                    x: x,
                    y: y
                  }
                }));
              }
              return state;
            }
          case "SET_EXPANDING_LINE_WIDTH":
            {
              var _regionId10 = state.mode.regionId;
              var _getRegion15 = getRegion(_regionId10),
                _getRegion16 = _slicedToArray(_getRegion15, 2),
                _expandingLine = _getRegion16[0],
                _regionIndex12 = _getRegion16[1];
              if (!_expandingLine) return state;
              var _lastPoint = _expandingLine.points.slice(-1)[0];
              var _state3 = state,
                _mouseDownAt = _state3.mouseDownAt;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex12, "expandingWidth"]), Math.sqrt(Math.pow(_lastPoint.x - x, 2) + Math.pow(_lastPoint.y - y, 2)));
            }
          default:
            return state;
        }
      }
    case "MOUSE_DOWN":
      {
        if (!activeImage) return state;
        var _x3 = action.x,
          _y3 = action.y;
        state = setIn(state, ["mouseDownAt"], {
          x: _x3,
          y: _y3
        });
        if (state.mode) {
          switch (state.mode.mode) {
            case "DRAW_POLYGON":
              {
                var _getRegion17 = getRegion(state.mode.regionId),
                  _getRegion18 = _slicedToArray(_getRegion17, 2),
                  _polygon2 = _getRegion18[0],
                  _regionIndex13 = _getRegion18[1];
                if (!_polygon2) break;
                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex13]), _objectSpread({}, _polygon2, {
                  points: _polygon2.points.concat([[_x3, _y3]])
                }));
              }
            case "DRAW_LINE":
              {
                var _getRegion19 = getRegion(state.mode.regionId),
                  _getRegion20 = _slicedToArray(_getRegion19, 2),
                  _line2 = _getRegion20[0],
                  _regionIndex14 = _getRegion20[1];
                if (!_line2) break;
                setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex14]), _objectSpread({}, _line2, {
                  x2: _x3,
                  y2: _y3
                }));
                return setIn(state, ["mode"], null);
              }
            case "DRAW_EXPANDING_LINE":
              {
                var _getRegion21 = getRegion(state.mode.regionId),
                  _getRegion22 = _slicedToArray(_getRegion21, 2),
                  _expandingLine2 = _getRegion22[0],
                  _regionIndex15 = _getRegion22[1];
                if (!_expandingLine2) break;
                var _lastPoint2 = _expandingLine2.points.slice(-1)[0];
                if (_expandingLine2.points.length > 1 && Math.sqrt(Math.pow(_lastPoint2.x - _x3, 2) + Math.pow(_lastPoint2.y - _y3, 2)) < 0.002) {
                  if (!_lastPoint2.width) {
                    return setIn(state, ["mode"], {
                      mode: "SET_EXPANDING_LINE_WIDTH",
                      regionId: state.mode.regionId
                    });
                  } else {
                    return state.setIn([].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex15]), convertExpandingLineToPolygon(_expandingLine2)).setIn(["mode"], null);
                  }
                }

                // Create new point
                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex15, "points"]), _expandingLine2.points.concat([{
                  x: _x3,
                  y: _y3,
                  angle: null,
                  width: null
                }]));
              }
            case "SET_EXPANDING_LINE_WIDTH":
              {
                var _getRegion23 = getRegion(state.mode.regionId),
                  _getRegion24 = _slicedToArray(_getRegion23, 2),
                  _expandingLine3 = _getRegion24[0],
                  _regionIndex16 = _getRegion24[1];
                if (!_expandingLine3) break;
                var expandingWidth = _expandingLine3.expandingWidth;
                return state.setIn([].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex16]), convertExpandingLineToPolygon(_objectSpread({}, _expandingLine3, {
                  points: _expandingLine3.points.map(function (p) {
                    return p.width ? p : _objectSpread({}, p, {
                      width: expandingWidth
                    });
                  }),
                  expandingWidth: undefined
                }))).setIn(["mode"], null);
              }
            default:
              break;
          }
        }
        var newRegion;
        var defaultRegionCls = state.selectedCls,
          defaultRegionColor = "#ff0000";
        var _clsIndex = (state.regionClsList || []).indexOf(defaultRegionCls);
        if (_clsIndex !== -1) {
          defaultRegionColor = colors[_clsIndex % colors.length];
        }
        switch (state.selectedTool) {
          case "create-point":
            {
              state = saveToHistory(state, "Create Point");
              newRegion = {
                type: "point",
                x: _x3,
                y: _y3,
                highlighted: true,
                editingLabels: true,
                color: defaultRegionColor,
                id: getRandomId(),
                cls: defaultRegionCls
              };
              break;
            }
          case "create-box":
            {
              state = saveToHistory(state, "Create Box");
              newRegion = {
                type: "box",
                x: _x3,
                y: _y3,
                w: 0,
                h: 0,
                highlighted: true,
                editingLabels: false,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "RESIZE_BOX",
                editLabelEditorAfter: true,
                regionId: newRegion.id,
                freedom: [1, 1],
                original: {
                  x: _x3,
                  y: _y3,
                  w: newRegion.w,
                  h: newRegion.h
                },
                isNew: true
              });
              break;
            }
          case "create-polygon":
            {
              if (state.mode && state.mode.mode === "DRAW_POLYGON") break;
              state = saveToHistory(state, "Create Polygon");
              newRegion = {
                type: "polygon",
                points: [[_x3, _y3], [_x3, _y3]],
                open: true,
                highlighted: true,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "DRAW_POLYGON",
                regionId: newRegion.id
              });
              break;
            }
          case "create-expanding-line":
            {
              state = saveToHistory(state, "Create Expanding Line");
              newRegion = {
                type: "expanding-line",
                unfinished: true,
                points: [{
                  x: _x3,
                  y: _y3,
                  angle: null,
                  width: null
                }],
                open: true,
                highlighted: true,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "DRAW_EXPANDING_LINE",
                regionId: newRegion.id
              });
              break;
            }
          case "create-line":
            {
              if (state.mode && state.mode.mode === "DRAW_LINE") break;
              state = saveToHistory(state, "Create Line");
              newRegion = {
                type: "line",
                x1: _x3,
                y1: _y3,
                x2: _x3,
                y2: _y3,
                highlighted: true,
                editingLabels: false,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "DRAW_LINE",
                regionId: newRegion.id
              });
              break;
            }
          case "create-keypoints":
            {
              state = saveToHistory(state, "Create Keypoints");
              var _ref2 = Object.entries(state.keypointDefinitions),
                _ref3 = _slicedToArray(_ref2, 1),
                _ref3$ = _slicedToArray(_ref3[0], 2),
                keypointsDefinitionId = _ref3$[0],
                _ref3$$ = _ref3$[1],
                _landmarks = _ref3$$.landmarks,
                connections = _ref3$$.connections;
              newRegion = {
                type: "keypoints",
                keypointsDefinitionId: keypointsDefinitionId,
                points: getLandmarksWithTransform({
                  landmarks: _landmarks,
                  center: {
                    x: _x3,
                    y: _y3
                  },
                  scale: 1
                }),
                highlighted: true,
                editingLabels: false,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "RESIZE_KEYPOINTS",
                landmarks: _landmarks,
                centerX: _x3,
                centerY: _y3,
                regionId: newRegion.id,
                isNew: true
              });
              break;
            }
          default:
            break;
        }
        var _regions = _toConsumableArray(getIn(state, pathToActiveImage).regions || []).map(function (r) {
          return setIn(r, ["editingLabels"], false).setIn(["highlighted"], false);
        }).concat(newRegion ? [newRegion] : []);
        if (typeof state.maxRegions === 'number') {
          // RFAVAS
          while (_regions.length > state.maxRegions) {
            _regions.shift();
          }
        }
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions);
      }
    case "MOUSE_UP":
      {
        var _x4 = action.x,
          _y4 = action.y;
        var _state4 = state,
          _state4$mouseDownAt = _state4.mouseDownAt,
          _mouseDownAt2 = _state4$mouseDownAt === void 0 ? {
            x: _x4,
            y: _y4
          } : _state4$mouseDownAt;
        if (!state.mode) {
          return state;
        }
        state = setIn(state, ["mouseDownAt"], null);
        switch (state.mode.mode) {
          case "RESIZE_BOX":
            {
              if (state.mode.isNew) {
                // if size < 0.002 dont create region
                if (Math.abs(state.mode.original.x - _x4) < 0.002 || Math.abs(state.mode.original.y - _y4) < 0.002) {
                  return setIn(modifyRegion(state.mode.regionId, null), ["mode"], null);
                }
              }
              if (typeof state.onChange === 'function') {
                state.onChange(state, action); // RFAVAS
              }

              if (state.mode.editLabelEditorAfter) {
                return _objectSpread({}, modifyRegion(state.mode.regionId, {
                  editingLabels: true
                }), {
                  mode: null
                });
              }
            }
          case "MOVE_REGION":
          case "RESIZE_KEYPOINTS":
          case "MOVE_LINE_POINT": // RF LINE
          case "MOVE_LINE":
          case "MOVE_POLYGON_POINT":
            {
              if (typeof state.onChange === 'function') {
                state.onChange(state, action); // RFAVAS
              }

              return _objectSpread({}, state, {
                mode: null
              });
            }
          case "MOVE_KEYPOINT":
            {
              if (typeof state.onChange === 'function') {
                state.onChange(state, action); // RFAVAS
              }

              return _objectSpread({}, state, {
                mode: null
              });
            }
          case "CREATE_POINT_LINE":
            {
              if (typeof state.onChange === 'function') {
                state.onChange(state, action); // RFAVAS
              }

              return state;
            }
          case "DRAW_EXPANDING_LINE":
            {
              var _getRegion25 = getRegion(state.mode.regionId),
                _getRegion26 = _slicedToArray(_getRegion25, 2),
                _expandingLine4 = _getRegion26[0],
                _regionIndex17 = _getRegion26[1];
              if (!_expandingLine4) return state;
              var newExpandingLine = _expandingLine4;
              var _lastPoint3 = _expandingLine4.points.length !== 0 ? _expandingLine4.points.slice(-1)[0] : _mouseDownAt2;
              var jointStart;
              if (_expandingLine4.points.length > 1) {
                jointStart = _expandingLine4.points.slice(-2)[0];
              } else {
                jointStart = _lastPoint3;
              }
              var _mouseDistFromLastPoint = Math.sqrt(Math.pow(_lastPoint3.x - _x4, 2) + Math.pow(_lastPoint3.y - _y4, 2));
              if (_mouseDistFromLastPoint > 0.002) {
                // The user is drawing has drawn the width for the last point
                var newPoints = _toConsumableArray(_expandingLine4.points);
                for (var i = 0; i < newPoints.length - 1; i++) {
                  if (newPoints[i].width) continue;
                  newPoints[i] = _objectSpread({}, newPoints[i], {
                    width: _lastPoint3.width
                  });
                }
                newExpandingLine = setIn(_expandingLine4, ["points"], fixTwisted(newPoints));
              } else {
                return state;
              }
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex17]), newExpandingLine);
            }
          default:
            return state;
        }
      }
    case "OPEN_REGION_EDITOR":
      {
        var _region7 = action.region;
        var _regionIndex18 = getRegionIndex(action.region);
        if (_regionIndex18 === null) return state;
        var newRegions = setIn(activeImage.regions.map(function (r) {
          return _objectSpread({}, r, {
            highlighted: false,
            editingLabels: false
          });
        }), [_regionIndex18], _objectSpread({}, (activeImage.regions || [])[_regionIndex18], {
          highlighted: true,
          editingLabels: true
        }));
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), newRegions);
      }
    case "CLOSE_REGION_EDITOR":
      {
        var _region8 = action.region;
        var _regionIndex19 = getRegionIndex(action.region);
        if (_regionIndex19 === null) return state;
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex19]), _objectSpread({}, (activeImage.regions || [])[_regionIndex19], {
          editingLabels: false
        }));
      }
    case "DELETE_REGION":
      {
        var _regionIndex20 = getRegionIndex(action.region);
        if (_regionIndex20 === null) return state;
        var _newState9 = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).filter(function (r) {
          return r.id !== action.region.id;
        }));
        if (typeof _newState9.onChange === 'function') {
          _newState9.onChange(_newState9, action); // RFAVAS
        }

        return _newState9;
      }
    case "DELETE_SELECTED_REGION":
      {
        var _newState10 = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).filter(function (r) {
          return !r.highlighted;
        }));
        if (typeof state.onChange === 'function') {
          _newState10.onChange(_newState10, action); // RFAVAS
        }

        return _newState10;
      }
    case "HEADER_BUTTON_CLICKED":
      {
        var buttonName = action.buttonName.toLowerCase();
        switch (buttonName) {
          case "prev":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === 0) return state;
              return setNewImage(state.images[currentImageIndex - 1], currentImageIndex - 1);
            }
          case "next":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === state.images.length - 1) return state;
              return setNewImage(state.images[currentImageIndex + 1], currentImageIndex + 1);
            }
          case "clone":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === state.images.length - 1) return state;
              return setIn(setNewImage(state.images[currentImageIndex + 1], currentImageIndex + 1), ["images", currentImageIndex + 1, "regions"], activeImage.regions);
            }
          case "settings":
            {
              return setIn(state, ["settingsOpen"], !state.settingsOpen);
            }
          case "help":
            {
              return state;
            }
          case "fullscreen":
            {
              return setIn(state, ["fullScreen"], true);
            }
          case "exit fullscreen":
          case "window":
            {
              return setIn(state, ["fullScreen"], false);
            }
          case "hotkeys":
            {
              return state;
            }
          case "exit":
          case "done":
            {
              return state;
            }
          default:
            return state;
        }
      }
    case "SELECT_TOOL":
      {
        if (action.selectedTool === "show-tags") {
          setInLocalStorage("showTags", !state.showTags);
          return setIn(state, ["showTags"], !state.showTags);
        } else if (action.selectedTool === "show-mask") {
          return setIn(state, ["showMask"], !state.showMask);
        }
        if (action.selectedTool === "modify-allowed-area" && !state.allowedArea) {
          state = setIn(state, ["allowedArea"], {
            x: 0,
            y: 0,
            w: 1,
            h: 1
          });
        }
        setInLocalStorage("selectedTool", action.selectedTool);
        state = setIn(state, ["mode"], null);
        return setIn(state, ["selectedTool"], action.selectedTool);
      }
    case "CANCEL":
      {
        var _state5 = state,
          mode = _state5.mode;
        if (mode) {
          switch (mode.mode) {
            case "DRAW_EXPANDING_LINE":
            case "SET_EXPANDING_LINE_WIDTH":
            case "DRAW_LINE":
            case "DRAW_POLYGON":
              {
                var _regionId11 = mode.regionId;
                return modifyRegion(_regionId11, null);
              }
            case "MOVE_POLYGON_POINT":
            case "RESIZE_BOX":
            case "MOVE_REGION":
              {
                return setIn(state, ["mode"], null);
              }
            default:
              return state;
          }
        }
        // Close any open boxes
        var _regions2 = activeImage.regions;
        if (_regions2 && _regions2.some(function (r) {
          return r.editingLabels;
        })) {
          return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions2.map(function (r) {
            return _objectSpread({}, r, {
              editingLabels: false
            });
          }));
        } else if (_regions2) {
          return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions2.map(function (r) {
            return _objectSpread({}, r, {
              highlighted: false
            });
          }));
        }
        break;
      }
    case "HIDE_REGIONS":
      {
        var _regions3 = activeImage.regions;
        var visible = _regions3.find(function (r) {
          return r.visible === false;
        }) == null;
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions3.map(function (r) {
          return _objectSpread({}, r, {
            visible: !visible
          });
        }));
      }
    case "LOCK_REGIONS":
      {
        var _regions4 = activeImage.regions;
        var locked = _regions4.find(function (r) {
          return r.locked === false;
        }) == null;
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions4.map(function (r) {
          return _objectSpread({}, r, {
            locked: !locked
          });
        }));
      }
    default:
      break;
  }
  return state;
});