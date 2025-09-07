import React, { useState } from "react";
import "./Slider.css";
import dayjs from "dayjs";

//fake data
const data = {
  started: "2025-08-19 23:20:05",
  task1: "2025-08-19 23:37:05",
  event1: "2025-08-20 00:12:19",
  task2: "2025-08-19 23:55:33",
  task3: "2025-08-20 01:48:56",
  event2: "2025-08-20 02:05:11",
  finished: "2025-08-20 02:20:05",
};

// function formatDate(date: string) {
//   return dayjs(date).format("DD/MM/YYYY HH:mm:ss"); // or customize as needed
// }

const Slider = () => {
  const startDate = dayjs(data.started).unix();
  const endDate = dayjs(data.finished).unix();
  const totalSeconds: number = endDate - startDate;

  // Store values as seconds offset from startDate
  const [pointer1Value, setPointer1Value] = useState(dayjs(data.task1).unix());

  // 10 min
  const [pointer2Value, setPointer2Value] = useState(dayjs(data.task2).unix()); // 30 min
  const [pointer3Value, setPointer3Value] = useState(dayjs(data.task3).unix()); // 60 min

  const [pointer1Position, setPointer1Position] = useState(pointer1Value);
  const [pointer2Position, setPointer2Position] = useState(pointer2Value);
  const [pointer3Position, setPointer3Position] = useState(pointer3Value);

  const updateValues = () => {
    const value2 = pointer2Value - pointer1Value;
    const value3 = pointer3Value - pointer2Value;
    const value4 = 100 - (value2 + value3);
    return { value2, value3, value4 };
  };

  const { value2, value3, value4 } = updateValues();

  // Helper to format a unix timestamp (number) as date string
  function formatUnix(unix: number) {
    console.log(unix);

    return dayjs.unix(unix).format("DD/MM/YYYY HH:mm:ss");
  }

  const onMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pointerIndex: number
  ) => {
    const sliderWidth: number = (event.currentTarget.parentNode as HTMLElement)
      .offsetWidth;
    let prevX: number = event.clientX;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX: number = e.clientX - prevX;
      const newPosition: number = Math.min(
        Math.max((event.currentTarget as HTMLElement).offsetLeft + deltaX, 0),
        sliderWidth
      );
      prevX = e.clientX;

      if (pointerIndex === 1) {
        setPointer1Position(newPosition);
        setPointer1Value(Math.round((newPosition / sliderWidth) * 100));
      } else if (pointerIndex === 2) {
        setPointer2Position(newPosition);
        setPointer2Value(Math.round((newPosition / sliderWidth) * 100));
      } else if (pointerIndex === 3) {
        setPointer3Position(newPosition);
        setPointer3Value(Math.round((newPosition / sliderWidth) * 100));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  console.log(pointer1Position);

  return (
    <>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ width: `${totalSeconds}px` }}
        ></div>
        <div
          className="slider-pointer"
          style={{ left: `${pointer1Position}px` }}
          data-value={pointer1Value}
          onMouseDown={(e) => onMouseDown(e, 1)}
        ></div>
        <div
          className="slider-pointer"
          style={{ left: `${pointer2Position}px` }}
          data-value={pointer2Value}
          onMouseDown={(e) => onMouseDown(e, 2)}
        ></div>
        <div
          className="slider-pointer"
          style={{ left: `${pointer3Position}px` }}
          data-value={pointer3Value}
          onMouseDown={(e) => onMouseDown(e, 3)}
        ></div>
      </div>
      <div className="result-container">
        <div>
          Value 1: <span id="value1">{value2}</span>
        </div>
        <div>
          Value 2: <span id="value2">{value3}</span>
        </div>
        <div>
          Value 3: <span id="value3">{value4}</span>
        </div>
        <div>
          Range:{" "}
          <span id="range">
            {formatUnix(startDate)} - {formatUnix(endDate)}
          </span>
        </div>
      </div>
    </>
  );
};

export default Slider;
