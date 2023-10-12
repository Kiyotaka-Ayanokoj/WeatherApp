import React from "react";

export default function Card(props: any) {
  return (
    <div className="temp">
      <div className="data" style={props.style}>
        <h5 className="card-title">{props.title}</h5>
        <h4 className="card-number">{props.temp}</h4>
        <span className="card-info">Despejado</span>
        </div>
    </div>
  );
}
