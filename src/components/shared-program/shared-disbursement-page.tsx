"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { IcOrg, Verivied } from "@/components/Icon/svg";
import { Tabs, TabsList, TabsTrigger } from "@/components/Tab";
import currencyFormater from "@/lib/utils";
import { getDisbursmentByCampaignId } from "@/services/disbursement";
import { IDisbursementCampaign } from "@/types/disbursement";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertTriangle, FileTextIcon, ImageIcon, Loader2Icon, Users2Icon, Wallet } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import SharedDisbursementDialog from "./shared-disbursement-dialog";

interface SharedDisbursementPageProps {
  campaignId: string;
}

const SharedDisbursementPage = ({ campaignId }: SharedDisbursementPageProps) => {
  const [activeTab, setActiveTab] = useState("penyaluran");

  const fetchDisbursement = async ({ pageParam = "", sort = "Terbaru" }): Promise<any> => {
    const topic = activeTab === "penyaluran" ? "penyaluran" : "withdrawal";
    const res = await getDisbursmentByCampaignId(sort, pageParam, campaignId, topic);
    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["disbursement", campaignId, activeTab],
    queryFn: fetchDisbursement,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading && isFetching) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-2 border-white w-full rounded-lg p-4 text-white animate-pulse bg-white/5">
            <div className="w-2/3 h-5 bg-white/20 mb-2 rounded" />
            <div className="w-1/3 h-3 bg-white/20 mb-4 rounded" />
            <div className="w-full h-[253px] bg-white/10 rounded-lg mb-4" />
            <div className="w-full h-4 bg-white/10 rounded mb-2" />
            <div className="w-[80%] h-4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl border-gray-200 border-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-200 max-w-sm text-sm">
          Terjadi kesalahan saat memuat data campaign. Silakan coba lagi nanti.
        </p>
      </section>
    );
  }

  const isEmpty =
    (data && data?.pages[0]?.length === 0) ||
    (data && data?.pages[0] === null) ||
    (data && data?.pages?.[0]?.data === null) ||
    (data && data?.pages?.[0]?.data.length === 0);

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-fesyar-green-700/10 backdrop-blur-xl border-2 border-white/80 h-auto p-1.5 rounded-xl">
          <TabsTrigger
            value="penyaluran"
            className="rounded-lg py-2 text-xs font-semibold transition-all data-[state=active]:bg-fesyar-gold data-[state=active]:text-fesyar-green-900 data-[state=active]:shadow-lg text-white"
          >
            Penyaluran
          </TabsTrigger>
          <TabsTrigger
            value="pencairan"
            className="rounded-lg py-2 text-xs font-semibold transition-all data-[state=active]:bg-fesyar-gold data-[state=active]:text-fesyar-green-900 data-[state=active]:shadow-lg text-white"
          >
            Pencairan
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isEmpty ? (
        <section className="flex flex-col items-center justify-center py-16 text-center bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl border-gray-200 border-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/50 mb-6">
            <Wallet className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Belum Ada {activeTab === "penyaluran" ? "Penyaluran" : "Pencairan"} Dana
          </h3>
          <p className="text-gray-200 max-w-md text-sm">
            Dana dari campaign ini belum pernah {activeTab === "penyaluran" ? "disalurkan" : "dicairkan"}. Informasi{" "}
            {activeTab === "penyaluran" ? "penyaluran" : "pencairan"} akan muncul di sini setelah tersedia.
          </p>
        </section>
      ) : (
        <InfiniteScroll
          // @ts-ignore
          loadMore={fetchNextPage}
          pageStart={0}
          hasMore={hasNextPage}
          loader={
            <div className="w-full inline-flex justify-center my-3" key={0}>
              <Loader2Icon size={20} className="animate-spin" />
            </div>
          }
          initialLoad={false}
          useWindow
        >
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group?.data?.map((item: any, index: number) => {
                return <Card data={item} key={index} />;
              })}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default SharedDisbursementPage;

const Card = ({ data }: { data: IDisbursementCampaign }) => {
  const momentObj = moment(data?.report_date);
  const timeAgo = momentObj.isValid() ? momentObj.fromNow() : "–";

  const [imageDialog, setImageDialog] = useState(false);
  const [reportImages, setReportImages] = useState<string[] | null>([]);

  const [fileDialog, setFileDialog] = useState(false);
  const [reportFiles, setReportFiles] = useState<string[] | null>([]);

  const [beneficiaryDialog, setBeneficiaryDialog] = useState(false);
  const [beneficiaryFile, setBeneficiaryFile] = useState<string | null>(null);

  const isPenyaluran = data?.report_topic?.toLowerCase() === "penyaluran";

  return (
    <div
      className="border-2 p-4 w-full rounded-lg mb-2 border-white backdrop-blur-3xl overflow-hidden"
      style={{
        background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
      }}
    >
      {/* IMAGES (Only for Penyaluran) */}
      {isPenyaluran && data?.report_images && data?.report_images?.length > 0 && (
        <div className="relative -mx-4 -mt-4 mb-4 overflow-hidden h-48">
          <img src={data?.report_images[0]} alt={data?.report_title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {/* TIME */}
      <p className="text-xs text-white">{timeAgo}</p>

      {/* PROFILE */}
      <div className="inline-flex items-center space-x-3 mt-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={""} alt={"Lembaga"} className="object-center object-cover bg-gray-100" />
          <AvatarFallback className="text-white">{data?.lembaga_name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="inline-flex space-x-1">
          <h2 className="text-sm font-semibold text-white">{data?.lembaga_name}</h2>
          <Verivied />
          <IcOrg />
        </div>
      </div>

      <p className="font-semibold text-lg my-3 text-transparent bg-clip-text bg-fesyar-gold">
        {isPenyaluran ? "Penyaluran" : "Pencairan"} Dana Rp{" "}
        {data?.amount_disbursed ? currencyFormater(data?.amount_disbursed) : "0"}
      </p>

      <span
        className="text-white text-sm dangerously-set-style"
        dangerouslySetInnerHTML={{ __html: data?.report_description }}
      />

      {/* ACTIONS (Only for Penyaluran) */}
      {isPenyaluran && (
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-white/20">
          {data?.report_images && data?.report_images?.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImageDialog(true);
                setReportImages(data?.report_images);
              }}
              className="flex items-center gap-2 text-xs text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-fesyar-gold hover:text-fesyar-green-900 transition-all font-medium"
            >
              <ImageIcon className="h-4 w-4" />
              <span>{data?.report_images?.length || 0} foto</span>
            </button>
          )}

          {data?.report_files && data?.report_files?.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFileDialog(true);
                setReportFiles(data?.report_files);
              }}
              className="flex items-center gap-2 text-xs text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-fesyar-gold hover:text-fesyar-green-900 transition-all font-medium"
            >
              <FileTextIcon className="h-4 w-4" />
              <span>{data?.report_files?.length} file</span>
            </button>
          )}

          {data?.beneficiary_file && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBeneficiaryDialog(true);
                setBeneficiaryFile(data?.beneficiary_file);
              }}
              className="flex items-center gap-2 text-xs text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-fesyar-gold hover:text-fesyar-green-900 transition-all font-medium"
            >
              <Users2Icon className="h-4 w-4" />
              <span>Laporan Penyaluran</span>
            </button>
          )}
        </div>
      )}

      <SharedDisbursementDialog
        open={imageDialog}
        onOpenChange={setImageDialog}
        type="image"
        data={reportImages}
        title="Lampiran Foto Penyaluran"
      />

      <SharedDisbursementDialog
        open={fileDialog}
        onOpenChange={setFileDialog}
        type="file"
        data={reportFiles}
        title="Lampiran Laporan Penyaluran"
      />

      <SharedDisbursementDialog
        open={beneficiaryDialog}
        onOpenChange={setBeneficiaryDialog}
        type="beneficiary"
        data={beneficiaryFile}
        title="Laporan Penyaluran"
      />
    </div>
  );
};
