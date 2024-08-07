// This component renders the navbar elements and assigns them title and onClick functionalities

import "./index.css";

export default function Navbar({ title, onClick }) {
  return (
    <div className={"ml-20 bg-fuchsia-700	text-white "} onClick={onClick}>
      {title}
    </div>
  );
}
