import "./index.css";

export default function Navbar({ title, onClick }) {
  return (
    <div className={"ml-20 text-kindOfLavender bg-white"} onClick={onClick}>
      {title}
    </div>
  );
}
