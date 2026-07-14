export type NgopiLandingConfig = {
  slug: string;
  titleText: string;
  titleImageUrl: string;
  logoUrl: string;
  backgroundUrl: string;
  campaignIds: string[];
};

export const defaultNgopiLandingConfig: NgopiLandingConfig = {
  slug: "ngopi",
  titleText: "WAKAFein FESyar Sumatera 2026",
  titleImageUrl: "/assets/wakafein/wakafein-fesyar-sumatera-2.png",
  logoUrl: "/assets/wakafein/logo-topbar.png",
  backgroundUrl: "/assets/wakafein/bg-kv-2026.jpg",
  campaignIds: [
    "9d52c675-2b96-499d-a94e-224fbae26817",
    "2384e557-cc9a-46b3-a809-e7d377901ebd",
    "ce7fcf60-7b55-4ee7-9531-9f0d599c7e60",
    "b157547a-1d68-4d73-9f18-14b41edddeee",
    "03cdb367-4943-4bb3-9d26-23faf7e4b910",
    "ad099c6d-96b7-4dd7-a747-f3e1b2073e66",
    "bd581f2b-d7e0-4582-a1e6-584b960f56d3",
    "a87b0611-0f2e-48dc-bbb0-ca2b678688ee",
    "92dda4bf-e178-4510-ac0e-c3fa8ebe28ca",
    "c3cca415-aba6-45f2-b535-88ace48c7b26",
  ],
};

export function normalizeNgopiLandingConfig(value: Partial<NgopiLandingConfig> | null | undefined): NgopiLandingConfig {
  const rawCampaignIds = value?.campaignIds;
  const campaignIds = Array.isArray(rawCampaignIds)
    ? rawCampaignIds.map((item) => String(item).trim()).filter(Boolean)
    : defaultNgopiLandingConfig.campaignIds;

  return {
    ...defaultNgopiLandingConfig,
    ...value,
    slug: value?.slug || defaultNgopiLandingConfig.slug,
    titleText: value?.titleText || defaultNgopiLandingConfig.titleText,
    titleImageUrl: value?.titleImageUrl || defaultNgopiLandingConfig.titleImageUrl,
    logoUrl: value?.logoUrl || defaultNgopiLandingConfig.logoUrl,
    backgroundUrl: value?.backgroundUrl || defaultNgopiLandingConfig.backgroundUrl,
    campaignIds,
  };
}
