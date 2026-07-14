"use client";

import LayoutReport from "@/components/Layout/layout-report";
import { loadOptionsCampaigns } from "@/lib/async-select";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";

const ReportCampaign = () => {
  const router = useRouter();

  return (
    <LayoutReport>
      <div className="py-4 grid place-items-center h-[80dvh] w-full">
        <div className="flex items-center flex-col w-full space-y-2">
          <h1 className="text-xl md:text-3xl font-bold">Laporan Program</h1>
          <p className="text-sm">Pilih Program Terlebih Dahulu</p>
          <AsyncSelect
            id="corp_unit_lvl1_id"
            cacheOptions
            name="corp_unit_lvl1_id"
            loadOptions={loadOptionsCampaigns()}
            defaultOptions={false}
            placeholder="Cari Program"
            onChange={(val: any) => {
              router.push(`/report/campaign/${val?.id}/national`);
            }}
            className="w-full text-xs font-light !text-black capitalize placeholder:text-xs max-w-lg"
            maxMenuHeight={150}
            noOptionsMessage={({ inputValue }) => (!inputValue ? `Ketikan Nama Program` : `Program tidak ditemukan`)}
            styles={{
              control: (base) => ({
                ...base,
                borderWidth: 1,
                borderRadius: 8,
              }),
              menu: (provided) => ({ ...provided, zIndex: 999 }),
            }}
          />
        </div>
      </div>
    </LayoutReport>
  );
};

export default ReportCampaign;
