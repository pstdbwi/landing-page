"use client";

import SharedBerwakafLandingPage from "@/app/berwakaf/_components/shared-berwakaf-landing-page";
import { CITY_OF_KALBAR } from "@/app/berwakaf/kalbar/city_of_kalbar";
import KalbarLayout from "./_components/kalbar-layout";

export default function LandingPage() {
  return (
    <KalbarLayout footer="landing-page">
      <SharedBerwakafLandingPage title="KALBAR Berwakaf" cities={CITY_OF_KALBAR} />
    </KalbarLayout>
  );
}
