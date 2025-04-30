import React, { useEffect, useState, memo } from "react"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"
import * as muiColors from "@mui/material/colors"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles } from "@mui/styles"

import colors from "../colors"
import Grid from "@mui/material/Grid"
import Tooltip from "@mui/material/Tooltip"

import BallotIcon from "@mui/icons-material/Ballot"
import capitalize from "lodash/capitalize"
import classnames from "classnames"
import { grey } from "@mui/material/colors"
import TrashIcon from "@mui/icons-material/Delete"
import LockIcon from "@mui/icons-material/Lock"
import UnlockIcon from "@mui/icons-material/LockOpen"
import VisibleIcon from "@mui/icons-material/Visibility"
import VisibleOffIcon from "@mui/icons-material/VisibilityOff"
import ReorderIcon from "@mui/icons-material/SwapVert"
import PieChartIcon from "@mui/icons-material/PieChart"


import setInLocalStorage from "./../utils/set-in-local-storage"
import getFromLocalStorage from "./../utils/get-from-local-storage"


import styles from "../RegionSelectorSidebarBox/styles"

const theme = createTheme()
const useStyles = makeStyles((theme) => styles)


// RFAVAS
const classShortcuts = {
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
}

const HeaderSep = styled("div")(({ theme }) => ({
  borderTop: `1px solid ${grey[200]}`,
  marginTop: 2,
  marginBottom: 2,
}))


const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible,
  onClick,
}) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container alignItems="center">
        <Grid item xs={1}>
          <div style={{ textAlign: "right", paddingRight: 4 }}>{order}</div>
        </Grid>
        <Grid item xs={6}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid>
    </div>
  )
}

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}


const RowHeader = ({ regions, onChangeRegion, onDeleteRegion }) => {
  const visible = regions.find(r => r.visible === false) == null;
  const locked = regions.find(r => r.locked === false) == null;
  return (
    <RowLayout
      header
      highlighted={false}
      order={<ReorderIcon className="icon" />}
      classification={<div style={{ paddingLeft: 10 }}>Name</div>}
      area={<PieChartIcon className="icon" />}
      trash={<TrashIcon className="icon" onClick={() => regions.forEach(r => onDeleteRegion(r))} />}
      lock={
        <Tooltip title='Lock / Unlock (l)'>
        {
          locked === true ? (
              <LockIcon
                onClick={() => {
                  regions.forEach(r =>  onChangeRegion({ ...r, locked: false }))
                }}
                className="icon"
              />
          ) : (
            <UnlockIcon
              onClick={() =>
                regions.forEach(r =>  onChangeRegion({ ...r, locked: true }))
              }
              className="icon"
            />
          )    
        }
        </Tooltip>
      }
      visible={
        <Tooltip title='Show / Hide (v)'>
          {
            visible ? (
              <VisibleIcon
                onClick={() => {
                  const hideCls = getFromLocalStorage("hideCls") || {};
                  regions.forEach(r => {
                     onChangeRegion({ ...r, visible: false })
                     hideCls[r.cls] = true;
                  })
                  setInLocalStorage("hideCls", hideCls);
                }}
                className="icon"
              />
            ) : (
              <VisibleOffIcon
                onClick={() => {
                  regions.forEach(r => {
                    onChangeRegion({ ...r, visible: true })
                  })
                  setInLocalStorage("hideCls", {});
                }}
                className="icon"
              />
            )
          }
        </Tooltip>
      }
    />
  )
}

const MemoRowHeader = memo(RowHeader)

const Row = ({
  highlighted,
  onSelectCls,
  onDeleteRegion,
  onChangeRegion,
  color,
  cls,
  index,
  regions,
}) => {
  const visible = regions.every(r => r.visible === true);
  const locked = regions.every(r => r.locked === true);
  return (
    <RowLayout
      header={false}
      highlighted={highlighted}
      onClick={() => {
        onSelectCls(cls)
      }}
      order={`${index + 1}`}
      classification={<Chip text={cls || ""} color={color || "#ddd"} />}
      area=""
      trash={
        <TrashIcon 
          onClick={
            () => {
              regions.forEach(r => onDeleteRegion(r))
            }
          } 
          className="icon2" 
        />
      }
      lock={
        locked ? (
          <LockIcon
            onClick={() => { 
              regions.forEach(r => {
                onChangeRegion({ ...r, locked: false })
              })
            }}
            className="icon2"
          />
        ) : (
          <UnlockIcon
          onClick={() => { 
            regions.forEach(r => {
              onChangeRegion({ ...r, locked: true })
            })
          }}
            className="icon2"
          />
        )
      }
      visible={
        visible ? (
          <VisibleIcon
            onClick={() => { 
              const hideCls = getFromLocalStorage("hideCls") || {};
              hideCls[cls] = true;
              setInLocalStorage("hideCls", hideCls)
              regions.forEach(r => {
                onChangeRegion({ ...r, visible: false })
              })
            }}
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
          onClick={() => { 
            const hideCls = getFromLocalStorage("hideCls") || {};
            delete hideCls[cls];
            setInLocalStorage("hideCls", hideCls);
            regions.forEach(r => {
              onChangeRegion({ ...r, visible: true })
            })
          }}
            className="icon2"
          />
        )
      }
    />
  )
}


const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color &&
    prevProps.regions === nextProps.regions
)


export const ClassSelectionMenu = ({
  regions,
  selectedCls,
  regionClsList,
  onSelectCls,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
}) => {
  const classes = useStyles()
  
  const [classifications, setClassifications] = useState([]);
  
  useEffect(() => {    
    const classifications = {}
    regions.forEach(e => {
      const cls = classifications[e.cls] = classifications[e.cls] || {
        id: e.cls,
        cls: e.cls,
        color: e.color,
        regions: [],
      }
      cls.regions.push(e);
    });
    setClassifications(Object.values(classifications))

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

  }, [regions, regionClsList, selectedCls])

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Classes" // RFAVAS Classifications -> Classes
        subTitle=""
        icon={<BallotIcon style={{ color: muiColors.grey[700] }} />}
        expandedByDefault
      >
        <div className={classes.container}>
          <MemoRowHeader 
            regions={regions}
            onChangeRegion={onChangeRegion}
            onDeleteRegion={onDeleteRegion}
          />
          <HeaderSep />
          {classifications.map((c, i) => (
            <MemoRow
              index={i}
              key={c.id}
              cls={c.cls}
              color={c.color}
              regions={c.regions}
              allRegions={regions}
              onSelectCls={onSelectCls}
              onDeleteRegion={onDeleteRegion}
              onChangeRegion={onChangeRegion}
            />
          ))}
        </div>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default ClassSelectionMenu