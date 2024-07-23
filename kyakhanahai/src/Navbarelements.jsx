import "./index.css";

export default function Navbar({ title, onClick }) {
  return (
    <div className={"ml-20 text-kindOfLavender"} onClick={onClick}>
      {title}
    </div>
  );
}
