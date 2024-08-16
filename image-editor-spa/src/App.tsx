import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

// import imgUrl from "./output.jpg";
// console.log(imgUrl);

const StyledApp = styled.div(
  () => css`
    width: 100%;
    height: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
    overflow: hidden;
  `
);

// W 63.5 - 74.824 x 12 - 24
// 6424 = 284, 29
// 6924 = 1656, 25
// 7424 = 3030, 27
// 6418 = 287, 1677
// 6918 = 1661, 1679
// 7418 = 3031, 1677
// 6412 = 281, 3334
// 6912 = 1661, 3372
// 7412 = 3040, 3336

// W2 63.5 - 74.824 x 12 - 24
// [ 336, 472, 64, 24 ],
// [ 1740, 503.5, 69, 24 ],
// [ 3125.5, 538.5, 74, 24 ],
// [ 323, 2158, 64, 18 ],
// [ 1720, 2182, 69, 18 ],
// [ 3098, 2205, 74, 18 ],
// [ 302, 3840.5, 64, 12 ],
// [ 1699, 3854.5, 69, 12 ],
// [ 3075, 3867.5, 74, 12 ]

// E 74.824 - 77.5 x 12 - 24
// 7524 = 142, 25
// 7624 = 420, 23
// 7724 = 698, 21
// 7518 = 153, 1696
// 7618 = 430, 1695
// 7718 = 706.5, 1694
// 7512 = 158, 3363
// 7612 = 436, 3361.5
// 7712 = 713, 3359

// E2 74.824 - 77.5 x 12 - 24
// [ 145, 602, 75, 24 ],
// [ 430.5, 605, 76, 24 ],
// [ 713.5, 609, 77, 24 ],
// [ 142, 2298, 75, 18 ],
// [ 425, 2300.5, 76, 18 ],
// [ 706, 2303, 77, 18 ],
// [ 131.5, 3994, 75, 12 ],
// [ 414, 3993.5, 76, 12 ],
// [ 695.5, 3992, 77, 12 ],

// Grid

// 2,2 = 22.6, 7.8
// 2,5 = 57.6, 15.2
// 2,8 = 92.2, 22.6

// 5,2 = 15, 42.8
// 5,5 = 50, 50
// 5,8 = 84.6, 57.6

// 8,2 = 7.4, 77.6
// 8,5 = 42.2, 85.2
// 8,8 = 77.2, 92.4

// HarveyMaps-GlenArtney
// 61, 23, 25.5 , 83
// 77, 23, 1534 , 36.5
// 61, 12, 59.5 , 1121
// 77, 23, 1563.5 , 1074.5

interface AppState {
  dragX: number | null;
  dragY: number | null;
  marginLeft: number;
  marginTop: number;
}

export function App() {
  const [state, setState] = useState({
    dragX: null,
    dragY: null,
    marginLeft: 0,
    marginTop: 0,
  } as AppState);
  const [img, setImg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const width = 512;
  const height = 512;
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const loadImg = new Image();
    loadImg.src = "./HarveyMaps-GlenArtney.png";
    loadImg.onload = () => {
      setImg(loadImg);
    };
  });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.style.marginLeft = state.marginLeft + "px";
    canvas.style.marginTop = state.marginTop + "px";
  }, [state.marginLeft, state.marginTop]);
  useEffect(() => {
    const canvas = ref.current;
    if (!img || !canvas) return;
    const w = zoomLevel * img.width;
    const h = zoomLevel * img.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
  }, [img]);
  return (
    <StyledApp>
      <canvas
        ref={ref}
        width={width}
        height={height}
        onClick={(e) => {
          const x = (e.clientX - e.target.offsetLeft) / zoomLevel;
          const y = (e.clientY - e.target.offsetTop) / zoomLevel;
          console.log("click", x, ",", y);
        }}
        onMouseDown={(e) => {
          let dragX = e.clientX - e.target.offsetLeft;
          let dragY = e.clientY - e.target.offsetTop;
          setState((prevState) => ({
            dragX,
            dragY,
            marginLeft: prevState.marginLeft,
            marginTop: prevState.marginTop,
          }));
          e.preventDefault();
        }}
        onMouseMove={(e) => {
          if (state.dragX !== null && state.dragY !== null) {
            let x = e.clientX - e.target.offsetLeft;
            let marginLeft = state.marginLeft + x - state.dragX;
            let y = e.clientY - e.target.offsetTop;
            let marginTop = state.marginTop + y - state.dragY;
            setState((prevState) => ({
              dragX: state.dragX,
              dragY: state.dragY,
              marginLeft,
              marginTop,
            }));
          }
          e.preventDefault();
        }}
        onMouseUp={(e) => {
          let x = e.clientX - e.target.offsetLeft;
          let marginLeft = state.marginLeft + x - state.dragX;
          let y = e.clientY - e.target.offsetTop;
          let marginTop = state.marginTop + y - state.dragY;
          setState((prevState) => ({
            dragX: null,
            dragY: null,
            marginLeft,
            marginTop,
          }));
          // console.log({
          //   offsetLeft: e.target.offsetLeft,
          //   clientX: e.clientX,
          //   marginLeft: state.marginLeft,
          //   lastX: state.lastX,
          // });
        }}
        onWheel={(e) => {
          let x = e.clientX - e.target.offsetLeft;
          let y = e.clientY - e.target.offsetTop;
          console.log("wheel", e.deltaY, x, y);
          setZoomLevel((prev) => {
            let newZoom = prev * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
            if (newZoom < 0.1) {
              newZoom = 0.1;
            }
            if (newZoom > 2) {
              newZoom = 2;
            }
            return newZoom;
          });
        }}
      ></canvas>
    </StyledApp>
  );
}
