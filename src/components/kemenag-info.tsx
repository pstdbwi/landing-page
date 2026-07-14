import { Fragment, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tab";
import { Button } from "./Button";

const KemenagInfo = () => {
  const [view, setView] = useState("info");
  return (
    <div className="">
      <h2 className="text-center font-bold">Informasi Wakaf ASN Kemenag</h2>
      <p className="text-sm">
        Gerakan wakaf uang ASN Kemenag mencakup jenis wakaf uang temporer atau permanen dengan ketentuan sebagai
        berikut:{" "}
      </p>
      {view == "info" ? (
        <Fragment>
          <table className="w-full table-fixed text-xs mt-2">
            <thead>
              <tr className="border">
                <th className="text-start border-x p-1">Item</th>
                <th className="text-start border-x p-1">Wakaf Temporer</th>
                <th className="text-start border-x p-1">Wakaf Permanen</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  item: "Nama Program",
                  temporer: "Wakaf Uang",
                  permanen: "Wakaf Uang",
                },
                {
                  item: "Periode waktu",
                  temporer: "Minimal 1 tahun",
                  permanen: "Selamanya",
                },
                {
                  item: "Wakaf Minimal",
                  temporer: "Rp 1.000.000,-",
                  permanen: "Tidak ada minimal",
                },
                {
                  item: "Nama Deposito",
                  temporer: "Wakif",
                  permanen: "Nazhir (BWI)",
                },
                {
                  item: "AIW < Rp 1 juta",
                  temporer: "Tidak ada",
                  permanen: "Atas nama wakif",
                },
                {
                  item: "SWU < Rp 1 juta",
                  temporer: "Tidak ada",
                  permanen: "Tidak ada",
                },
                {
                  item: "Perolehan AIW/SWU",
                  temporer: "Langsung via Aplikasi",
                  permanen: "Langsung via Aplikasi",
                },
                {
                  item: "Bentuk AIW/SWU",
                  temporer: "PDF",
                  permanen: "PDF",
                },
              ].map((value) => (
                <tr key={value.item} className="border">
                  <td className="border-x p-1">{value.item}</td>
                  <td className="border-x p-1">{value.temporer}</td>
                  <td className="border-x p-1">{value.permanen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      ) : (
        <Fragment>
          <Tabs defaultValue="satker" className="w-full text-sm">
            <TabsList className="w-full border-none bg-transparent p-1 border h-fit">
              <TabsTrigger value="satker" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Asal Satker
              </TabsTrigger>
              <TabsTrigger value="ditjen" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Ditjen
              </TabsTrigger>
              <TabsTrigger value="pegtinggi" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Perg.Tinggi
              </TabsTrigger>
              <TabsTrigger value="provinsi" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Provinsi
              </TabsTrigger>
              <TabsTrigger value="kabkot" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Kab/Kota
              </TabsTrigger>
            </TabsList>
            <TabsContent value="satker">
              <div className="">
                <table className="w-full table-fixed text-xs">
                  <thead>
                    <tr className="border">
                      <th className="text-start border-x p-1">Unit</th>
                      <th className="text-start border-x p-1">Wakif</th>
                      <th className="text-start border-x p-1">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[].map((value: any) => (
                      <tr key={value.item} className="border">
                        <td className="border-x p-1">{value.item}</td>
                        <td className="border-x p-1">{value.temporer}</td>
                        <td className="border-x p-1">{value.permanen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          <Button onClick={() => setView("info")} className="w-full mt-2" size="sm" variant="outline">
            Kembali
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export default KemenagInfo;
