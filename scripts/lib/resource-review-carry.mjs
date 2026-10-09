// Le report conserve aussi les défauts : il ne réévalue ni ne réaffirme la revue.
export function carryResourceReview(precedent) {
  const revue = precedent?.claimsEvidence?.sensitiveMatter?.businessReview;
  if (!revue || typeof revue.status !== 'string' || revue.status === 'PENDING') return null;
  return {
    revue: structuredClone(revue),
    checkedAt: precedent.claimsEvidence.sensitiveMatter.checkedAt,
    p0: [...(precedent.quality?.p0 ?? [])],
    p1: [...(precedent.quality?.p1 ?? [])],
    blocking: precedent.quality?.blocking ?? false,
  };
}
