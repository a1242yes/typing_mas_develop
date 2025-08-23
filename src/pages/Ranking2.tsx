import React from "react";
import "./Ranking2.css";

// 주어진 이름과 타수로 업데이트된 items 배열
const items = [
  {
    ranking: 1,
    studentId: "1101",
    name: "기태연",
    tasu: 0,
    profilePic: "/img/1101.png",
  },
  {
    ranking: 2,
    studentId: "1102",
    name: "김효일",
    tasu: 0,
    profilePic: "/img/1102.png",
  },
  {
    ranking: 3,
    studentId: "1103",
    name: "박진우",
    tasu: 0,
    profilePic: "/img/1103.png",
  },
  {
    ranking: 4,
    studentId: "1104",
    name: "서규원",
    tasu: 0,
    profilePic: "/img/1104.png",
  },
  {
    ranking: 5,
    studentId: "1105",
    name: "신해",
    tasu: 0,
    profilePic: "/img/1105.png",
  },
  {
    ranking: 6,
    studentId: "1106",
    name: "육준성",
    tasu: 0,
    profilePic: "/img/1106.png",
  },
  {
    ranking: 7,
    studentId: "1107",
    name: "윤시웅",
    tasu: 0,
    profilePic: "/img/1107.png",
  },
  {
    ranking: 8,
    studentId: "1108",
    name: "윤정후",
    tasu: 0,
    profilePic: "/img/1108.png",
  },
  {
    ranking: 9,
    studentId: "1109",
    name: "이민준",
    tasu: 0,
    profilePic: "/img/1109.png",
  },
  {
    ranking: 10,
    studentId: "1110",
    name: "이상희",
    tasu: 0,
    profilePic: "/img/1110.png",
  },
];

const Ranking2 = () => {
  return (
    <div className="fullScreen">
      <div className="top-panel">
        <img src="/img/mirim.png" className="mirim-png" alt="Mirim Logo" />
        <p>타자연습</p>
        <img src="/img/human.png" className="human-png" alt="human" />
      </div>
      <div className="bottom">
        <p className="change">단어 연습</p>
        <p>실시간 랭킹</p>
      </div>
      <div className="ranking-container">
        <div className="ranking-row">
          {items.slice(0, 5).map((item) => (
            <div className="ranking-item" key={item.ranking}>
              <p className="ranking">{item.ranking}등</p>
              <img
                src={item.profilePic} // profilePic을 사용하여 이미지 경로 지정
                alt="profile"
                className="profile-pic"
              />
              <p className="name">{item.name}</p>
              <p className="tasu">타수: {item.tasu}</p>
            </div>
          ))}
        </div>
        <div className="ranking-row">
          {items.slice(5, 10).map((item) => (
            <div className="ranking-item" key={item.ranking}>
              <p className="ranking">{item.ranking}등</p>
              <img
                src={item.profilePic} // profilePic을 사용하여 이미지 경로 지정
                alt="profile"
                className="profile-pic"
              />
              <p className="name">{item.name}</p>
              <p className="tasu">타수: {item.tasu}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ranking2;
