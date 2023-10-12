import { useState, useEffect } from "react";

export default function Header(props: any) {
    return (
        <div className="navBar" style={props.style}>
          <span className="header-title">Agrovoltaica</span>
        </div>
    );
}