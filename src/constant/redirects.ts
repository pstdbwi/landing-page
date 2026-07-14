const redirects: Record<string, string> = {
  "/haji": "/campaign/a664f679-37e6-4e58-88e7-64bc6b87d5ae?share=1&title=wakaf-haji-dan-umrah",
  "/rekonstruksigaza":
    "/campaign/4940a780-ff21-4dd3-a790-601353292fea?share=1&title=wakaf-rekonstruksi-masjid-dan-rumah-sakit-gaza",
  "/ASNKemenag":
    "/campaign/9d52c675-2b96-499d-a94e-224fbae26817?share=1&title=gerakan-wakaf-uang-kementerian-agama-1446-h",
  "/asnkemenag":
    "/campaign/9d52c675-2b96-499d-a94e-224fbae26817?share=1&title=gerakan-wakaf-uang-kementerian-agama-1446-h",
  "/wakafpalestina":
    "/campaign/4940a780-ff21-4dd3-a790-601353292fea?share=1&title=wakaf-rekonstruksi-masjid-dan-rumah-sakit-gaza",
  "/wakafkemaslahatan": "/campaign/b157547a-1d68-4d73-9f18-14b41edddeee?share=1&title=wakaf-untuk-kemaslahatan-umat",
  "/wakafgaza": "/campaign/4940a780-ff21-4dd3-a790-601353292fea?title=wakaf-rekonstruksi-masjid-dan-rumah-sakit-gaza",
  "/wakafdisabilitas": "/campaign/32729010-24de-4515-ae63-b67ab0038335?share=1&title=wakaf-untuk-disabilitas",
  "/wakafmasjidpelosok": "/campaign/b8775f36-89fc-4069-931f-557b4f6f2f8a?share=1&title=wakaf-renovasi-masjid-tak-layak",
  "/wakafpendidikan": "/campaign/6f192a00-1011-464d-bde5-d6e4449c286b?share=1&title=wakaf-uang-untuk-pendidikan",
  "/danaabadimasjid": "/campaign/f1e7f800-eb21-4020-a621-a1ddf87e08ed?share=1&title=wakaf-dana-abadi-untuk-masjid",
  "/wakafhutan": "/campaign/ad099c6d-96b7-4dd7-a747-f3e1b2073e66?share=1&title=wakaf-untuk-hutan",
  "/wakafkebunkelengkeng":
    "/campaign/609e0f19-76c5-4aa5-991a-8a18c829b439?share=1&title=wakaf-produktif-kebun-kelengkeng",
  "/wakafgedungmarzuki":
    "/campaign/950b78ea-8ea1-4aec-b43b-e4d985aa58fd?share=1&title=pembangunan-gedung-mahmud-marzuki-tower",
  "/wakafvilapenghafalquran":
    "/campaign/05891077-42f2-4918-861a-16883a56bb3a?share=1&title=wakaf-produktif-untuk-membangun-villa-karantina-tahfidz-al-qur'an",
  "/wakafmasjidalaqso":
    "/campaign/e426cda5-0f4b-4a80-ae95-d4c38bd93407?share=1&title=penyelesaian-pembangunan-masjid-al-aqsho-puspendai-al-fikri",
  "/wakafbudidayapatin":
    "/campaign/3cc7bec3-1d84-49a5-9587-7258590affbf?share=1&title=wakaf-produktif-budidaya-ikan-patin-untuk-kesejahteraan-pesantren",
  "/wakafkebunkelengkenguntukpenghafalquran":
    "/campaign/4fa025cc-c1ca-4c0b-a8ff-d6088967ffdf?share=1&title=progam-wakaf-produktif-kebun-lengkeng-untuk-penghafal-al-quran",
  "/danaabadipaisekolah":
    "/campaign/ce7fcf60-7b55-4ee7-9531-9f0d599c7e60?share=1&title=gerakan-wakaf-uang-dana-abadi-pendidikan-agama-islam-di-sekolah",
  "/wakafrsachmadwardi":
    "/campaign/bfd21308-671a-4a82-9172-6010f0b85633?share=1&title=wakaf-perluasan-lahan-rs-mata-achmad-wardi",

  // REPORT
  "/reportASNKemenag": "/report/asn-kemenag",
  "/reportasnkemenag": "/report/asn-kemenag",
  "/reportwakafpalestina": "/report/program/4940a780-ff21-4dd3-a790-601353292fea",
  "/reportwakafmasjidterpencil": "/report/program/b8775f36-89fc-4069-931f-557b4f6f2f8a",
  "/reportprogram": "/report/program",
  "/reportdanaabadimasjid": "/report/dana-abadi-masjid",
  "/reportwakafistiqlalbwi":
    "/report/program/4940a780-ff21-4dd3-a790-601353292fea/wakif?program_name=Wakaf+Istiqlal+x+BWI",
  "/reporthutanwakaf": "/report/program/ad099c6d-96b7-4dd7-a747-f3e1b2073e66",
  "/reportkebunkelengkeng": "/report/program/609e0f19-76c5-4aa5-991a-8a18c829b439",
  "/reportgedungmarzuki": "/report/program/950b78ea-8ea1-4aec-b43b-e4d985aa58fd",
  "/reportvilakarantina": "/report/program/05891077-42f2-4918-861a-16883a56bb3a",
  "/reportmasjidalaqso": "/report/program/e426cda5-0f4b-4a80-ae95-d4c38bd93407",
  "/reportwakafbudidayapatin": "/report/program/3cc7bec3-1d84-49a5-9587-7258590affbf",
  "/reportwakafkebunkelengkenguntukpenghafalquran": "/report/program/4fa025cc-c1ca-4c0b-a8ff-d6088967ffdf",
  "/reportdanaabadipaisekolah": "/report/campaign/ce7fcf60-7b55-4ee7-9531-9f0d599c7e60/national",
  "/reportdanaabadipai": "/report/campaign/ce7fcf60-7b55-4ee7-9531-9f0d599c7e60/national",
  "/report-pai": "/report/campaign/ce7fcf60-7b55-4ee7-9531-9f0d599c7e60/national",
  "/reportwakafrsachmadwardi": "/report/program/bfd21308-671a-4a82-9172-6010f0b85633",

  // SPECIAL SECTION
  "/wakaframadhanbwi": "/explore/special-section/d15e7450-fff6-42ce-841d-01152955bf60",
  // "/gerakansadarwakafjatim2025": "/explore/special-section/2ce76b42-07f8-4b42-a3a2-9f8c977a2a8a",
  // "/gerakansadarwakaf2025": "/explore/special-section/2ce76b42-07f8-4b42-a3a2-9f8c977a2a8a",
};

export default redirects;
