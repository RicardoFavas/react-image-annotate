import makeImmutable from "seamless-immutable"
import { getPolygonCenter, moveRegion } from "../../ImageCanvas/region-tools"
import generalReducer from "./general-reducer"
import historyHandler from "./history-handler"
import combineReducers from "./combine-reducers"
import videoReducer from "./video-reducer"

// The legacy Jest setup cannot load uuidv7's ESM build. Movement never creates IDs.
jest.mock("uuidv7", () => ({ uuidv7: () => "new-region" }))

const polygon = {
  id: "polygon",
  type: "polygon",
  points: [
    [0.2, 0.1],
    [0.6, 0.2],
    [0.5, 0.7],
    [0.3, 0.5],
  ],
  color: "#f0f",
  cls: "Object",
  tags: ["example"],
  highlighted: true,
  editingLabels: true,
}

const expectTranslation = (moved, original, dx, dy) => {
  expect(moved.points).toHaveLength(original.points.length)
  moved.points.forEach(([x, y], i) => {
    expect(x).toBeCloseTo(original.points[i][0] + dx)
    expect(y).toBeCloseTo(original.points[i][1] + dy)
  })
  expect(moved.id).toBe(original.id)
  expect(moved.cls).toBe(original.cls)
  expect(moved.tags).toEqual(original.tags)
}

const imageState = (region = polygon, onChange = jest.fn()) =>
  makeImmutable({
    annotationType: "image",
    selectedImage: 0,
    selectedTool: "select",
    images: [{ src: "example.jpg", regions: [region] }],
    mode: null,
    history: [],
    onChange,
  })

const beginMove = { type: "BEGIN_MOVE_POLYGON", polygon }

afterEach(() => jest.restoreAllMocks())

test("translates every polygon point equally without mutating the original", () => {
  const original = makeImmutable(polygon)
  const moved = moveRegion(original, 0.55, 0.625)

  expect(getPolygonCenter(original)).toEqual({ x: 0.4, y: 0.375 })
  expectTranslation(moved, original, 0.15, 0.25)
  expect(original.points).toEqual(polygon.points)
  expect(moveRegion({ ...polygon, points: [] }, 0.5, 0.5).points).toEqual([])
})

test("drags the complete polygon, reports changes on release, and undoes once", () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(1000)
  const onChange = jest.fn()
  const reducer = historyHandler(generalReducer)
  const original = imageState(polygon, onChange)
  let state = reducer(original, beginMove)

  expect(state.mode).toEqual({
    mode: "MOVE_REGION",
    regionId: polygon.id,
    dragOffset: { x: 0, y: 0 },
  })
  expect(state.images[0].regions[0].editingLabels).toBe(false)
  state = reducer(state, { type: "MOUSE_MOVE", x: 0.55, y: 0.625 })
  expectTranslation(state.images[0].regions[0], polygon, 0.15, 0.25)

  now.mockReturnValue(1020)
  state = reducer(state, { type: "MOUSE_MOVE", x: 0.35, y: 0.275 })
  expectTranslation(state.images[0].regions[0], polygon, -0.05, -0.1)
  state = reducer(state, { type: "MOUSE_UP", x: 0.35, y: 0.275 })

  expect(state.mode).toBe(null)
  expect(onChange).toHaveBeenCalledTimes(1)
  expectTranslation(
    onChange.mock.calls[0][0].images[0].regions[0],
    polygon,
    -0.05,
    -0.1
  )
  expect(state.history).toHaveLength(1)
  expect(state.history[0].name).toBe("Move Polygon")
  state = reducer(state, { type: "RESTORE_HISTORY" })
  expect(state.images[0].regions[0]).toEqual(polygon)
  expect(original.images[0].regions[0]).toEqual(polygon)
})

test("grabbing off-center moves the polygon by the pointer delta without a jump", () => {
  const now = jest.spyOn(Date, "now").mockReturnValue(1000)
  const point = { x: 0.404, y: 0.372 }
  let state = generalReducer(imageState(), { ...beginMove, point })

  state = generalReducer(state, { type: "MOUSE_MOVE", ...point })
  expectTranslation(state.images[0].regions[0], polygon, 0, 0)

  now.mockReturnValue(1020)
  state = generalReducer(state, { type: "MOUSE_MOVE", x: 0.504, y: 0.422 })
  expectTranslation(state.images[0].regions[0], polygon, 0.1, 0.05)
  const center = getPolygonCenter(state.images[0].regions[0])
  expect(center.x).toBeCloseTo(0.5)
  expect(center.y).toBeCloseTo(0.425)
})

test.each([
  { ...polygon, locked: true },
  { ...polygon, open: true },
  { ...polygon, points: polygon.points.slice(0, 2) },
])("does not start moving a locked, open, or incomplete polygon", (region) => {
  const state = generalReducer(imageState(region), {
    type: "BEGIN_MOVE_POLYGON",
    polygon: region,
  })
  expect(state.mode).toBe(null)
  expect(state.images[0].regions[0].points).toEqual(region.points)
})

test("individual vertex dragging still moves only that vertex", () => {
  jest.spyOn(Date, "now").mockReturnValue(1000)
  let state = generalReducer(imageState(), {
    type: "BEGIN_MOVE_POLYGON_POINT",
    polygon,
    pointIndex: 1,
  })
  state = generalReducer(state, { type: "MOUSE_MOVE", x: 0.8, y: 0.9 })
  expect(state.images[0].regions[0].points).toEqual([
    polygon.points[0],
    [0.8, 0.9],
    polygon.points[2],
    polygon.points[3],
  ])
})

test("polygon movement creates an editable video keyframe and can undo it", () => {
  jest.spyOn(Date, "now").mockReturnValue(1000)
  const original = makeImmutable({
    annotationType: "video",
    selectedTool: "select",
    currentVideoTime: 500,
    keyframes: {
      0: { regions: [polygon] },
      1000: { regions: [polygon] },
    },
    mode: null,
    history: [],
  })
  const reducer = historyHandler(combineReducers(videoReducer, generalReducer))
  let state = reducer(original, beginMove)
  state = reducer(state, { type: "MOUSE_MOVE", x: 0.55, y: 0.625 })
  state = reducer(state, { type: "MOUSE_UP", x: 0.55, y: 0.625 })

  expectTranslation(state.keyframes[500].regions[0], polygon, 0.15, 0.25)
  expect(state.keyframes[0]).toEqual(original.keyframes[0])
  expect(state.keyframes[1000]).toEqual(original.keyframes[1000])
  state = reducer(state, { type: "RESTORE_HISTORY" })
  expect(state.keyframes[500]).toBeUndefined()
})

test("point and box movement retain their existing behavior", () => {
  expect(moveRegion({ type: "point", x: 0.1, y: 0.2 }, 0.5, 0.6)).toEqual({
    type: "point",
    x: 0.5,
    y: 0.6,
  })
  const moved = moveRegion(
    { type: "box", x: 0.1, y: 0.2, w: 0.2, h: 0.4 },
    0.5,
    0.6
  )
  expect(moved.x).toBeCloseTo(0.4)
  expect(moved.y).toBeCloseTo(0.4)
  expect(moved.w).toBe(0.2)
  expect(moved.h).toBe(0.4)
})
