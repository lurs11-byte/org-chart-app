import { useEffect, useRef, useState } from "react";
import "./Toolbar.css";

export default function Toolbar({ title, onTitleChange, onAdd }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setDraft(title);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, title]);

  function commit() {
    const next = draft.trim();
    onTitleChange(next || title);
    setEditing(false);
  }

  return (
    <div className="toolbar">
      {editing ? (
        <input
          ref={inputRef}
          className="toolbar__title toolbar__title-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
        />
      ) : (
        <button className="toolbar__title" onClick={() => setEditing(true)} title="Click to rename">
          {title}
        </button>
      )}
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
