import type { AccessRequest, Capability, Member } from './domain';

/** Describe only evidence supplied by the workspace API; never infer a Tide decision. */
export function delegationEvidence(
  capability: Capability,
  member: Member,
  requests: AccessRequest[],
  preview: boolean,
) {
  const request = preview ? null : [...requests].reverse().find(
    item => item.subject === member.subject && item.capability === capability,
  ) ?? null;
  const access: 'unverified' | 'available' | 'not-in-session' = preview
    ? 'unverified'
    : member.capabilities.includes(capability) ? 'available' : 'not-in-session';

  return { request, access, tideReview: 'not-observed' as const };
}
