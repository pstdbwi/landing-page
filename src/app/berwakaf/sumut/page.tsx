"use client";

import SharedBerwakafLandingPage from "@/app/berwakaf/_components/shared-berwakaf-landing-page";
import SumutLayout from "./_components/sumut-layout";
import { CITIES_OF_SUMUT } from "./cities-sumut";

export default function LandingPage() {
  return (
    <SumutLayout footer="landing-page">
      <SharedBerwakafLandingPage title="WAKAF SUMUT BERKAH" cities={CITIES_OF_SUMUT} />
    </SumutLayout>
  );
}
