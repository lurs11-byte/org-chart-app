export function getDescendantIds(entities, rootId) {
  const children = entities.filter((e) => e.reportsTo === rootId).map((e) => e.id);
  return children.reduce(
    (acc, childId) => [...acc, childId, ...getDescendantIds(entities, childId)],
    []
  );
}

export function canReportTo(entities, nodeId, candidateParentId) {
  if (candidateParentId === nodeId) return false;
  const descendants = getDescendantIds(entities, nodeId);
  return !descendants.includes(candidateParentId);
}
