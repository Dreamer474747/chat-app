import type { GroupType, PrivateType, GroupInbox, PrivateInbox } from "u/types";

export declare async function authUser(): { _id: string } | null;
export declare async function getChatInfos(): (GroupType | PrivateType)[];
export declare async function getInboxes(): (GroupInbox | PrivateInbox)[];
