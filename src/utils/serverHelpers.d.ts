import type { GroupType, PrivateType } from "u/types";

export declare async function authUser(): { _id: string } | null;
export declare async function getInbox(): {
groups: GroupType[] | [],
privates: PrivateType[] | []
} | null;
