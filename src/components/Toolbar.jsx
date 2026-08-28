import "./Toolbar.css";

export default function Toolbar({ onAdd }) {
  return (
    <div className="toolbar">
      <div className="toolbar__title">Org chart</div>
      <div className="toolbar__actions">
        <button className="btn btn--ghost" onClick={() => onAdd("person")}>
          + Person
        </button>
        <button className="btn btn--ghost" onClick={() => onAdd("team")}>
          + Team
        </button>
        <button className="btn btn--ghost" onClick={() => onAdd("area")}>
          + Area of responsibility
        </button>
      </div>
    </div>
  );
}
