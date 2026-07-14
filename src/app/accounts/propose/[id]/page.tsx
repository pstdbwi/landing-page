"use client";

import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useGetApplicationDetail } from "@/services/donor/hooks";
import { AlertTriangle, BookOpen, Building2, CreditCard, FileText, Inbox, Loader2, Receipt } from "lucide-react";
import moment from "moment";
import "moment/locale/id";

interface Props {
  params: { id: string };
}

const DetailPropose = ({ params }: Props) => {
  const applicationId = params?.id;
  const { data, isLoading, isError } = useGetApplicationDetail({
    applicationId,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Sedang memuat data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-600">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">Terjadi kesalahan saat mengambil data.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500">
        <Inbox className="w-8 h-8 mb-2" />
        <p className="text-sm">Data tidak ditemukan.</p>
      </div>
    );
  }

  const {
    applicant_name,
    applicant_birth_place,
    applicant_birth_date,
    applicant_job,
    applicant_province_name,
    applicant_city_name,
    applicant_address,
    bank_account_name,
    bank_account_number,
    bank_name,
    campaign_title,
    donor_name,
    created_at,
    supporting_doc_url,
    bank_book_url,
    id_card_url,
    organization_information,
    organization_license_url,
    reason,
    status,
    transfer_date,
    transfer_amount,
    transfer_evidence_url,
    type_of_assistance,
  } = data;

  const statusLabel: Record<string, string> = {
    waiting: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
    done: "Selesai",
  };

  const fields = [
    { label: "Nama Pemohon", value: applicant_name },
    {
      label: "Tempat/Tanggal Lahir",
      value: `${applicant_birth_place}, ${new Date(applicant_birth_date).toLocaleDateString("id-ID")}`,
    },
    { label: "Pekerjaan", value: applicant_job },
    {
      label: "Alamat",
      value: `${applicant_address}, ${applicant_city_name}, ${applicant_province_name}`,
    },
    { label: "Alasan", value: reason || "-" },
    {
      label: "Bank",
      value: `${bank_name} - ${bank_account_number} a.n ${bank_account_name}`,
    },
    { label: "Campaign", value: campaign_title },
    { label: "Jenis Bantuan", value: type_of_assistance || "-" },
    {
      label: "Status",
      value: (
        <Badge variant={status} className="capitalize">
          {statusLabel[status] ?? status}
        </Badge>
      ),
    },
    { label: "Tanggal Pengajuan", value: moment(created_at).locale("id").format("LLL") },
  ];

  return (
    <section className="p-4 max-w-[800px] mx-auto space-y-3 pb-16">
      <h1 className="text-xl font-bold text-gray-800">Detail Pengajuan Manfaat</h1>

      {/* Detail Info */}
      <Card className="shadow-sm border rounded-xl pt-3 ">
        <CardContent className="divide-y">
          {fields.map((f, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-2 text-sm">
              <span className="font-medium text-gray-600">{f.label}</span>
              <span className="col-span-2 text-gray-800">: {f.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Organization Section */}
      {(organization_information || organization_license_url) && (
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-md font-semibold text-gray-800 mb-2">Informasi Organisasi</h2>
            {organization_information && (
              <div className="grid grid-cols-3 gap-4  text-sm">
                <span className="font-medium text-gray-600">Nama Institusi</span>
                <span className="col-span-2 text-gray-800">: {organization_information}</span>
              </div>
            )}
            {organization_license_url && (
              <Button
                variant="outline"
                className="flex items-center gap-2 h-12 w-full "
                onClick={() => window.open(organization_license_url, "_blank")}
              >
                <Building2 className="w-4 h-4" /> Lihat Dokumen Organisasi
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transfer Section */}
      {(transfer_amount || transfer_date || transfer_evidence_url) && (
        <Card className="shadow-sm border rounded-xl">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-md font-semibold text-gray-800">Informasi Transfer</h2>

            {/* Info Grid */}
            <div className="divide-y">
              <div className="grid grid-cols-3 gap-4 py-2 text-sm">
                <span className="font-medium text-gray-600">Jumlah</span>
                <span className="col-span-2 text-gray-800">
                  : {transfer_amount ? `Rp ${transfer_amount.toLocaleString("id-ID")}` : "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-2 text-sm">
                <span className="font-medium text-gray-600">Tanggal</span>
                <span className="col-span-2 text-gray-800">
                  : {transfer_date === "0001-01-01T00:00:00Z" ? "-" : moment(transfer_date).locale("id").format("LLL")}
                </span>
              </div>
            </div>

            {/* Bukti Transfer */}
            {transfer_evidence_url && (
              <div className="w-full ">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12 w-full "
                  onClick={() => window.open(transfer_evidence_url, "_blank")}
                >
                  <Receipt className="w-4 h-4" /> Lihat Bukti Transfer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dokumen Section */}
      <Card className="shadow-sm border rounded-xl">
        <CardContent className="p-4">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Dokumen</h2>
          <div className="grid grid-cols-1  gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 w-full"
              onClick={() => window.open(supporting_doc_url, "_blank")}
            >
              <FileText className="w-4 h-4" /> Dokumen Pendukung
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 w-full"
              onClick={() => window.open(bank_book_url, "_blank")}
            >
              <BookOpen className="w-4 h-4" /> Buku Bank
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 w-full"
              onClick={() => window.open(id_card_url, "_blank")}
            >
              <CreditCard className="w-4 h-4" /> KTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default DetailPropose;
