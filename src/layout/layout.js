import dagre from "dagre";

const DIMENSIONS = {
  person: { width: 220, height: 96 },
  team: { width: 200, height: 76 },
  area: { width: 200, height: 76 },
};

const EXEC_DIMENSIONS = { width: 240, height: 108 };

export function dimensionsFor(entity) {
  const base =
    entity.type === "person" && entity.department === "exec"
      ? EXEC_DIMENSIONS
      : DIMENSIONS[entity.type] || DIMENSIONS.person;
  const tagAllowance = entity._areaCount > 0 ? 30 : 0;
  return { width: base.width, height: base.height + tagAllowance };
}

export function computeLayout(entities) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 36, ranksep: 70 });

  entities.forEach((e) => {
    g.setNode(e.id, { ...dimensionsFor(e) });
  });

  entities.forEach((e) => {
    if (e.reportsTo && entities.some((o) => o.id === e.reportsTo)) {
      g.setEdge(e.reportsTo, e.id);
    }
  });

  dagre.layout(g);

  const positions = {};
  entities.forEach((e) => {
    const node = g.node(e.id);
    const dim = dimensionsFor(e);
    positions[e.id] = {
      x: node.x - dim.width / 2,
      y: node.y - dim.height / 2,
    };
  });

  return positions;
}

export { DIMENSIONS };
