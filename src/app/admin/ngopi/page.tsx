"use client";

import { defaultNgopiLandingConfig, normalizeNgopiLandingConfig, type NgopiLandingConfig } from "@/lib/ngopi-landing-config";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type CampaignSearchResult = {
  id: string;
  title: string;
  banner_url?: string;
  lembaga?: {
    name?: string;
  };
};

const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

const labelClassName = "text-xs font-semibold uppercase tracking-wide text-slate-600";

export default function NgopiAdminPage() {
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState<NgopiLandingConfig>(defaultNgopiLandingConfig);
  const [campaignIdInput, setCampaignIdInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<CampaignSearchResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState("");

  const campaignIdsText = useMemo(() => config.campaignIds.join("\n"), [config.campaignIds]);

  useEffect(() => {
    async function loadConfig() {
      const response = await fetch("/api/landing-config?slug=ngopi", { cache: "no-store" });
      const result = await response.json();
      setConfig(normalizeNgopiLandingConfig(result?.data));
    }

    loadConfig().catch(() => setConfig(defaultNgopiLandingConfig));
  }, []);

  const updateField = (field: keyof NgopiLandingConfig, value: string) => {
    setConfig((current) => normalizeNgopiLandingConfig({ ...current, [field]: value }));
  };

  const updateCampaignIds = (value: string) => {
    setConfig((current) =>
      normalizeNgopiLandingConfig({
        ...current,
        campaignIds: value
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    );
  };

  const addCampaignId = (campaignId: string) => {
    const nextId = campaignId.trim();
    if (!nextId) return;

    setConfig((current) => {
      if (current.campaignIds.includes(nextId)) return current;
      return normalizeNgopiLandingConfig({ ...current, campaignIds: [...current.campaignIds, nextId] });
    });
    setCampaignIdInput("");
  };

  const removeCampaignId = (campaignId: string) => {
    setConfig((current) =>
      normalizeNgopiLandingConfig({
        ...current,
        campaignIds: current.campaignIds.filter((item) => item !== campaignId),
      }),
    );
  };

  const moveCampaignId = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= config.campaignIds.length) return;

    setConfig((current) => {
      const next = [...current.campaignIds];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return normalizeNgopiLandingConfig({ ...current, campaignIds: next });
    });
  };

  const searchCampaigns = async () => {
    if (!search.trim()) return;

    setIsSearching(true);
    setStatus("");

    try {
      const response = await fetch(
        `https://api.satuwakafindonesia.id/campaigns?status=ACTIVE&search=${encodeURIComponent(search)}&page=0&size=8`,
      );
      const result = await response.json();
      setSearchResults(result?.data?.items || []);
    } catch (error) {
      setStatus("Gagal mencari campaign dari API Satuwakaf.");
    } finally {
      setIsSearching(false);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/admin/landing-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(config),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Gagal menyimpan konfigurasi.");
      }

      setConfig(normalizeNgopiLandingConfig(result?.data));
      setStatus("Konfigurasi berhasil disimpan.");
    } catch (error: any) {
      setStatus(error?.message || "Gagal menyimpan konfigurasi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Landing Page</p>
          <h1 className="text-3xl font-bold">Ngopi / WAKAFein</h1>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className={labelClassName}>Password Admin</span>
                <input
                  type="password"
                  className={fieldClassName}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password admin"
                />
              </label>

              <label className="space-y-2">
                <span className={labelClassName}>Judul Landing Page</span>
                <input
                  className={fieldClassName}
                  value={config.titleText}
                  onChange={(event) => updateField("titleText", event.target.value)}
                />
              </label>
            </div>

            <label className="space-y-2 block">
              <span className={labelClassName}>Image Judul Landing Page</span>
              <input
                className={fieldClassName}
                value={config.titleImageUrl}
                onChange={(event) => updateField("titleImageUrl", event.target.value)}
                placeholder="https://... atau /assets/..."
              />
            </label>

            <label className="space-y-2 block">
              <span className={labelClassName}>Logo</span>
              <input
                className={fieldClassName}
                value={config.logoUrl}
                onChange={(event) => updateField("logoUrl", event.target.value)}
                placeholder="https://... atau /assets/..."
              />
            </label>

            <label className="space-y-2 block">
              <span className={labelClassName}>Background</span>
              <input
                className={fieldClassName}
                value={config.backgroundUrl}
                onChange={(event) => updateField("backgroundUrl", event.target.value)}
                placeholder="https://... atau /assets/..."
              />
            </label>

            <div className="space-y-3">
              <span className={labelClassName}>Program yang Ditampilkan</span>
              <textarea
                className={`${fieldClassName} min-h-[180px] font-mono`}
                value={campaignIdsText}
                onChange={(event) => updateCampaignIds(event.target.value)}
                spellCheck={false}
              />

              <div className="flex gap-2">
                <input
                  className={fieldClassName}
                  value={campaignIdInput}
                  onChange={(event) => setCampaignIdInput(event.target.value)}
                  placeholder="Campaign ID"
                />
                <button
                  type="button"
                  onClick={() => addCampaignId(campaignIdInput)}
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Tambah
                </button>
              </div>

              <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
                {config.campaignIds.map((campaignId, index) => (
                  <div key={campaignId} className="flex items-center justify-between gap-3 px-3 py-2">
                    <code className="text-xs text-slate-700">{campaignId}</code>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveCampaignId(index, -1)}
                        className="rounded border border-slate-200 px-2 py-1 text-xs"
                      >
                        Naik
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCampaignId(index, 1)}
                        className="rounded border border-slate-200 px-2 py-1 text-xs"
                      >
                        Turun
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCampaignId(campaignId)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={saveConfig}
              disabled={isSaving}
              className="w-full rounded-md bg-[#071c3d] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
            </button>

            {status ? <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">{status}</p> : null}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-bold">Cari Campaign Satuwakaf</h2>
              <div className="flex gap-2">
                <input
                  className={fieldClassName}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Contoh: Palestina, Wakaf Hutan"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") searchCampaigns();
                  }}
                />
                <button
                  type="button"
                  onClick={searchCampaigns}
                  disabled={isSearching}
                  className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Cari
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {searchResults.map((campaign) => (
                  <div key={campaign.id} className="flex gap-3 rounded-md border border-slate-200 p-3">
                    {campaign.banner_url ? (
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-200">
                        <Image src={campaign.banner_url} fill alt="" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">{campaign.title}</p>
                      <p className="text-xs text-slate-500">{campaign.lembaga?.name}</p>
                      <code className="mt-1 block truncate text-xs text-slate-500">{campaign.id}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => addCampaignId(campaign.id)}
                      className="h-fit rounded-md bg-[#DAB95A] px-3 py-2 text-xs font-bold text-[#071c3d]"
                    >
                      Pakai
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-bold">Preview Visual</h2>
              <div className="relative overflow-hidden rounded-lg bg-[#071c3d] p-5 text-white">
                {config.backgroundUrl ? (
                  <Image src={config.backgroundUrl} fill alt="" className="object-cover opacity-40" />
                ) : null}
                <div className="relative z-10 flex flex-col items-center gap-5">
                  {config.logoUrl ? (
                    <Image src={config.logoUrl} width={320} height={90} alt="Logo" className="h-auto max-h-20 w-auto" />
                  ) : null}
                  {config.titleImageUrl ? (
                    <Image
                      src={config.titleImageUrl}
                      width={420}
                      height={110}
                      alt={config.titleText}
                      className="h-auto max-h-24 w-auto"
                    />
                  ) : (
                    <p className="text-center text-2xl font-bold text-[#DAB95A]">{config.titleText}</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
