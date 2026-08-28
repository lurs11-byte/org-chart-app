import { Handle, Position } from "@xyflow/react";
import { dimensionsFor } from "../layout/layout";
import { iconFor } from "./icons";
import "./EntityNode.css";

export default function EntityNode({ data }) {
  const { entity, areas = [], onEdit, onDelete } = data;
  const isExec = entity.type === "person" && entity.department === "exec";
  const dim = dimensionsFor(entity);
  const dept = entity.department || "exec";
  const Icon = iconFor(entity);

  const subtitle =
    entity.type === "person"
      ? entity.title
      : entity.type === "team"
      ? entity.notes || "Team"
      : "Area of responsibility";

  return (
    <div
      className={`entity-card entity-card--${entity.type} dept-${dept} ${isExec ? "entity-card--exec" : ""}`}
      style={{ width: dim.width, minHeight: dim.height }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="entity-card__actions">
        <button className="entity-card__icon-btn" title="Edit" onClick={() => onEdit(entity)}>
          ✎
        </button>
        <button className="entity-card__icon-btn" title="Delete" onClick={() => onDelete(entity)}>
          ✕
        </button>
      </div>

      <div className="entity-card__avatar">
        {entity.type === "person" && entity.imageUrl ? (
          <img src={entity.imageUrl} alt={entity.name} />
        ) : (
          <Icon className="entity-card__avatar-icon" />
        )}
      </div>

      <div className="entity-card__name">{entity.name}</div>
      <div className="entity-card__divider" />
      <div className="entity-card__title">{subtitle}</div>

      {areas.length > 0 && (
        <div className="entity-card__tags">
          {areas.map((area) => (
            <span key={area.id} className={`area-tag dept-${area.department || dept}`}>
              <button className="area-tag__label" onClick={() => onEdit(area)} title="Edit area of responsibility">
                {area.name}
              </button>
              <button className="area-tag__x" onClick={() => onDelete(area)} title="Delete">
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
