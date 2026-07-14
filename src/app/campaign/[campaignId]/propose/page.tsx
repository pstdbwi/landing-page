"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import StepOne from "./step-one";

const Propose = ({
  params,
  searchParams,
}: {
  params: { campaignId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // const { currentStep, setCurrentStep } = useStepperStore();

  return (
    <section className="layout bg-white relative min-h-screen ">
      <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] sticky top-0 z-50">
        <Link href={`/campaign/${params?.campaignId}`}>
          <ArrowLeftIcon size={18} />
        </Link>

        <p className="ml-5 font-semibold">Permohonan Manfaat Wakaf</p>
      </div>

      {/* <div className="mt-20 fixed layout w-full bg-white z-50">
        <Stepper steps={[{ label: "Isi Data Diri" }, { label: "Isi Identitas Pelengkap" }]} />
      </div> */}

      {/* <div className="mt-44 fixed layout w-full bg-white z-50 px-3"> */}
      <div className="mt-3 layout w-full bg-white px-3 pb-20">
        <StepOne campaignId={params.campaignId} />
      </div>
    </section>
  );
};

export default Propose;
