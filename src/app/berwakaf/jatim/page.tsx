"use client";

import SharedBerwakafLandingPage from "@/app/berwakaf/_components/shared-berwakaf-landing-page";
import JatimLayout from "./_components/jatim-layout";
import { CITIES_OF_JATIM } from "./cities-jatim";

export default function LandingPage() {
  return (
    <JatimLayout footer="landing-page">
      <SharedBerwakafLandingPage title="Gerakan Sadar Wakaf Jawa Timur" cities={CITIES_OF_JATIM} />
    </JatimLayout>
  );
}
