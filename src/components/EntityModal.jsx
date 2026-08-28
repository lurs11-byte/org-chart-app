import { useState } from "react";
import { canReportTo } from "../utils/hierarchy";
import "./EntityModal.css";

const DEPARTMENTS = [
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "technology", label: "Technology" },
  { value: "operations", label: "Operations" },
];

export default function EntityModal({ mode, initial, entities, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    type: initial?.type || "person",
    name: initial?.name || "",
    title: initial?.title || "",
    department: initial?.department || "product",
    reportsTo: initial?.reportsTo ?? "",
    imageUrl: initial?.imageUrl || "",
    notes: initial?.notes || "",
  }));

  const isCeo = initial?.department === "exec";

  const managerOptions = entities.filter((e) => {
    if (!initial) return true;
    return canReportTo(entities, initial.id, e.id);
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      name: form.name.trim(),
      title: form.title.trim(),
      reportsTo: form.reportsTo || null,
      department: isCeo ? "exec" : form.department,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{mode === "add" ? "Add" : "Edit"} {form.type === "person" ? "person" : form.type === "team" ? "team" : "area of responsibility"}</h2>

        {mode === "add" && (
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option value="person">Person</option>
              <option value="team">Team / department</option>
              <option value="area">Area of responsibility</option>
            </select>
          </label>
        )}

        <label className="field">
          <span>Name</span>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={form.type === "person" ? "e.g. Dana" : "e.g. Development Team"}
            required
          />
        </label>

        {form.type === "person" && (
          <label className="field">
            <span>Job title</span>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Product Manager" />
          </label>
        )}

        {!isCeo && (
          <label className="field">
            <span>Department</span>
            <select value={form.department} onChange={(e) => update("department", e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {!isCeo && (
          <label className="field">
            <span>Reports to</span>
            <select value={form.reportsTo || ""} onChange={(e) => update("reportsTo", e.target.value)}>
              <option value="">— none (top level) —</option>
              {managerOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {form.type === "person" && (
          <label className="field">
            <span>Profile image URL (optional)</span>
            <input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://…" />
          </label>
        )}

        <label className="field">
          <span>Notes (optional)</span>
          <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
