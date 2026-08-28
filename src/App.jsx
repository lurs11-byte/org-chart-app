import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuid } from "uuid";

import seedData from "./data/seedData";
import { computeLayout } from "./layout/layout";
import { canReportTo } from "./utils/hierarchy";
import EntityNode from "./nodes/EntityNode";
import Toolbar from "./components/Toolbar";
import EntityModal from "./components/EntityModal";
import "./App.css";

const STORAGE_KEY = "org-chart-entities";
const TITLE_STORAGE_KEY = "org-chart-app-title";
const DEFAULT_TITLE = "Org chart";
const nodeTypes = { entity: EntityNode };

function loadEntities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage, fall back to seed
  }
  return seedData;
}

function loadTitle() {
  return localStorage.getItem(TITLE_STORAGE_KEY) || DEFAULT_TITLE;
}

// Areas of responsibility render as tags on their manager's card instead of
// their own node, unless they have no valid manager to attach to.
function splitAreas(entities) {
  const nonAreaIds = new Set(entities.filter((e) => e.type !== "area").map((e) => e.id));
  const attachedAreas = [];
  const standaloneEntities = [];

  entities.forEach((e) => {
    if (e.type === "area" && e.reportsTo && nonAreaIds.has(e.reportsTo)) {
      attachedAreas.push(e);
    } else {
      standaloneEntities.push(e);
    }
  });

  const areasByParent = attachedAreas.reduce((acc, a) => {
    (acc[a.reportsTo] = acc[a.reportsTo] || []).push(a);
    return acc;
  }, {});

  return { standaloneEntities, areasByParent };
}

function buildNodes(standaloneEntities, positions, areasByParent, onEdit, onDelete) {
  return standaloneEntities.map((e) => ({
    id: e.id,
    type: "entity",
    position: positions[e.id] || { x: 0, y: 0 },
    data: { entity: e, areas: areasByParent[e.id] || [], onEdit, onDelete },
  }));
}

function buildEdges(standaloneEntities) {
  return standaloneEntities
    .filter((e) => e.reportsTo && standaloneEntities.some((o) => o.id === e.reportsTo))
    .map((e) => ({
      id: `${e.reportsTo}->${e.id}`,
      source: e.reportsTo,
      target: e.id,
      type: "smoothstep",
      style: { stroke: "var(--line)", strokeWidth: 1.5 },
    }));
}

function Chart() {
  const [entities, setEntities] = useState(loadEntities);
  const [title, setTitle] = useState(loadTitle);
  const [modalState, setModalState] = useState(null); // { mode, type, initial }
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { getIntersectingNodes } = useReactFlow();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  }, [entities]);

  useEffect(() => {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }, [title]);

  const openEdit = useCallback((entity) => {
    setModalState({ mode: "edit", type: entity.type, initial: entity });
  }, []);

  const openAdd = useCallback((type) => {
    setModalState({ mode: "add", type, initial: { type } });
  }, []);

  const requestDelete = useCallback(
    (entity) => {
      const label = entity.type === "person" ? entity.name : `"${entity.name}"`;
      const message =
        entity.type === "area"
          ? `Delete ${label}?`
          : `Delete ${label}? Anyone reporting to them moves up to their manager.`;
      if (!window.confirm(message)) return;
      setEntities((prev) =>
        prev
          .filter((e) => e.id !== entity.id)
          .map((e) => (e.reportsTo === entity.id ? { ...e, reportsTo: entity.reportsTo } : e))
      );
    },
    [setEntities]
  );

  // recompute layout whenever the underlying data changes
  useEffect(() => {
    const { standaloneEntities, areasByParent } = splitAreas(entities);
    const entitiesForLayout = standaloneEntities.map((e) => {
      const count = (areasByParent[e.id] || []).length;
      return count ? { ...e, _areaCount: count } : e;
    });
    const positions = computeLayout(entitiesForLayout);
    setNodes(buildNodes(standaloneEntities, positions, areasByParent, openEdit, requestDelete));
    setEdges(buildEdges(standaloneEntities));
  }, [entities, openEdit, requestDelete, setNodes, setEdges]);

  const handleNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const handleNodeDragStop = useCallback(
    (event, draggedNode) => {
      const overlaps = getIntersectingNodes(draggedNode).filter((n) => n.id !== draggedNode.id);
      if (overlaps.length === 0) return;

      const target = overlaps[0];
      const dragged = entities.find((e) => e.id === draggedNode.id);
      if (!dragged || dragged.reportsTo === target.id) return;
      if (!canReportTo(entities, dragged.id, target.id)) return;

      setEntities((prev) => prev.map((e) => (e.id === dragged.id ? { ...e, reportsTo: target.id } : e)));
    },
    [entities, getIntersectingNodes]
  );

  function handleSave(data) {
    if (modalState.mode === "add") {
      setEntities((prev) => [...prev, { ...data, id: uuid() }]);
    } else {
      setEntities((prev) => prev.map((e) => (e.id === modalState.initial.id ? { ...e, ...data } : e)));
    }
    setModalState(null);
  }

  return (
    <div className="chart-page">
      <Toolbar title={title} onTitleChange={setTitle} onAdd={openAdd} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onNodeDragStop={handleNodeDragStop}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e3e0d8" gap={22} size={1.5} />
        <Controls showInteractive={false} />
      </ReactFlow>

      {modalState && (
        <EntityModal
          mode={modalState.mode}
          initial={modalState.initial}
          entities={entities}
          onSave={handleSave}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Chart />
    </ReactFlowProvider>
  );
}
