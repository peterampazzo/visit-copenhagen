export type GuideItem = {
  name: string;
  note?: string;
  url?: string;
};

export type GuideGroup = {
  title: string;
  items: GuideItem[];
};

export type GuideSectionData = {
  id: string;
  emoji: string;
  title: string;
  blurb?: string;
  groups: GuideGroup[];
};
