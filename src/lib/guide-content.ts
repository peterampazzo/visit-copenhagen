export type GuideItem = {
  id: string;
  name: string;
  note?: string;
  url?: string;
  kicker?: string;
  story?: string;
};

export type GuideGroup = {
  id: string;
  title: string;
  route?: {
    label: string;
    stops: string[];
  };
  items: GuideItem[];
};

export type GuideSectionData = {
  id: string;
  emoji: string;
  title: string;
  blurb?: string;
  groups: GuideGroup[];
};

type GuideItemRecord = Omit<GuideItem, "id">;

type GuideGroupRecord = {
  title: string;
  route?: {
    label: string;
    stops: string[];
  };
  items: Record<string, GuideItemRecord>;
};

export type GuideSectionRecord = {
  emoji: string;
  title: string;
  blurb?: string;
  groups: Record<string, GuideGroupRecord>;
};

export type GuideSectionsRecord = Record<string, GuideSectionRecord>;

const GUIDE_ORDER = [
  { id: "know", groups: ["transport", "cycling", "everyday"] },
  {
    id: "places",
    groups: ["classics", "stories", "harbour", "neighbourhoods", "modern", "trips"],
  },
  { id: "food", groups: ["markets", "dining"] },
  { id: "pastries", groups: ["bakeries"] },
  { id: "museums", groups: ["art"] },
  { id: "saunas", groups: ["sweat"] },
  { id: "inspiration", groups: ["things"] },
] as const;

function preferredEntries<T>(record: Record<string, T>, preferred: readonly string[]) {
  const preferredSet = new Set(preferred);
  return [
    ...preferred.flatMap((key) => (record[key] ? ([[key, record[key]]] as const) : [])),
    ...Object.entries(record).filter(([key]) => !preferredSet.has(key)),
  ];
}

export function toGuideSections(resources: GuideSectionsRecord): GuideSectionData[] {
  return preferredEntries(
    resources,
    GUIDE_ORDER.map(({ id }) => id),
  ).map(([sectionId, section]) => {
    const preferredGroups = GUIDE_ORDER.find(({ id }) => id === sectionId)?.groups ?? [];
    return {
      id: sectionId,
      emoji: section.emoji,
      title: section.title,
      ...(section.blurb === undefined ? {} : { blurb: section.blurb }),
      groups: preferredEntries(section.groups, preferredGroups).map(([groupId, group]) => ({
        id: groupId,
        title: group.title,
        ...(group.route === undefined ? {} : { route: group.route }),
        items: Object.entries(group.items).map(([itemId, item]) => ({ id: itemId, ...item })),
      })),
    };
  });
}
