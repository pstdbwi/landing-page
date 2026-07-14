import { Fragment } from 'react';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

type Campaign = {
  id: string;
  title: string;
  short_description?: string;
  image_url?: string;
  image?: string;
  donation_net_amount?: number;
  target_amount?: number;
  donation_target?: number;
  banner_url?: string;
  category_name?: string;
  lembaga_name?: string;
  city_name?: string;
  location?: string;
  status?: string;
};

type CampaignRow = {
  id: string;
  title: string;
  short_description: string | null;
  banner_url: string | null;
  donation_net_amount: number | string | null;
  donation_target: number | string | null;
  city_name: string | null;
  lembaga_name: string | null;
};

const globalForPg = globalThis as typeof globalThis & {
  campaignLandingPool?: Pool;
};

const FALLBACK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Wakaf Ternak Produktif untuk Santri Papua Barat',
    short_description: 'Baitul Wakaf',
    image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 49_960_000,
    target_amount: 49_900_000,
    city_name: 'Manokwari',
  },
  {
    id: '2',
    title: 'Wakaf Produktif Budidaya Pangan untuk Santri',
    short_description: 'MPW PW Muhammadiyah Bengkulu',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 100_050_000,
    target_amount: 100_000_000,
    city_name: 'Kota Bengkulu',
  },
  {
    id: '3',
    title: 'Wakaf Sumur Masjid Nurul Ijtihad Maros',
    short_description: 'Yayasan Daarut Tauhiid',
    image_url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 71_298_000,
    target_amount: 150_000_000,
    city_name: 'Maros',
  },
  {
    id: '4',
    title: 'Wakaf Sumur Air Bersih Pesantren di Sulawesi',
    short_description: 'Yayasan Wakaf Infaq Zakat dan Shodaqoh Pesantren',
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 80_000_000,
    target_amount: 80_000_000,
    city_name: 'Morowali',
  },
  {
    id: '5',
    title: 'Wakaf Produktif Budidaya Pisang untuk Santri',
    short_description: 'Yayasan Solo Peduli Ummat',
    image_url: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 99_036_000,
    target_amount: 99_036_000,
    city_name: 'Karanganyar',
  },
  {
    id: '6',
    title: 'Wakaf Sumber Air Bersih di Kabupaten Cianjur',
    short_description: 'Wakaf Al Azhar',
    image_url: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 44_910_000,
    target_amount: 42_660_000,
    city_name: 'Cianjur',
  },
  {
    id: '7',
    title: 'Wakaf Renovasi Rumah Tahfidz',
    short_description: 'Wiztren Indonesia',
    image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 38_250_000,
    target_amount: 75_000_000,
    city_name: 'Bandung',
  },
  {
    id: '8',
    title: 'Wakaf Pendidikan untuk Generasi Qurani',
    short_description: 'Bank Indonesia Peduli',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 62_775_000,
    target_amount: 100_000_000,
    city_name: 'Jakarta',
  },
  {
    id: '9',
    title: 'Wakaf Pangan untuk Keluarga Prasejahtera',
    short_description: 'SatuWakaf Indonesia',
    image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85',
    donation_net_amount: 55_450_000,
    target_amount: 90_000_000,
    city_name: 'Bogor',
  },
];

function databasePool() {
  if (globalForPg.campaignLandingPool) return globalForPg.campaignLandingPool;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const host = process.env.POSTGRE_HOST || process.env.DB_HOST;
  const user = process.env.POSTGRE_USERNAME || process.env.DB_USER;
  const password = process.env.POSTGRE_PASSWORD || process.env.DB_PASSWORD;
  const database = process.env.POSTGRE_NAME || process.env.DB_NAME || 'postgres';
  const port = Number(process.env.POSTGRE_PORT || process.env.DB_PORT || 5432);
  const sslMode = process.env.POSTGRE_SSLMODE || process.env.DB_SSLMODE || 'require';
  const ssl = sslMode === 'disable' ? false : { rejectUnauthorized: false };

  if (!connectionString && (!host || !user || !password)) return null;

  globalForPg.campaignLandingPool = connectionString
    ? new Pool({ connectionString, ssl })
    : new Pool({ host, port, user, password, database, ssl });

  return globalForPg.campaignLandingPool;
}

function assetUrl(path?: string | null) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = process.env.ASSET_BASE_URL || 'https://storage.googleapis.com/ziswaf-asset-stg';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function normalizeCampaign(row: any): Campaign {
  const imagePath =
    row.image_url ||
    row.banner_url ||
    row.image ||
    row.thumbnail_url ||
    row.campaign_banner_url ||
    row.featured_image;

  return {
    id: String(row.id),
    title: row.title || row.campaign_title || 'Program Wakaf',
    short_description: row.short_description || row.summary || row.description,
    image_url: assetUrl(imagePath),
    banner_url: assetUrl(row.banner_url || row.campaign_banner_url),
    image: assetUrl(row.image),
    donation_net_amount: Number(row.donation_net_amount || row.final_donation_amount || row.total_donation_amount || 0),
    target_amount: Number(row.target_amount || row.donation_target || 0),
    donation_target: Number(row.donation_target || row.target_amount || 0),
    category_name: row.category_name,
    lembaga_name: row.lembaga_name || row.lembaga?.name || row.institution_name,
    city_name: row.city_name || row.location?.city || row.city?.name,
    location: row.location_name || row.location,
    status: row.status,
  };
}

async function fetchCampaigns(): Promise<Campaign[]> {
  const db = databasePool();
  if (db) {
    try {
      const result = await db.query<CampaignRow>(`
        SELECT
          c.id::text,
          c.title,
          c.short_description,
          c.banner_url,
          COALESCE(w.total_donation_amount, 0) AS donation_net_amount,
          COALESCE(c.donation_target, 0) AS donation_target,
          cities.name AS city_name,
          c.lembaga_name
        FROM public.campaigns c
        LEFT JOIN public.campaign_wallets w ON w.campaign_id = c.id
        LEFT JOIN public.cities cities ON cities.id = c.city_id
        WHERE c.deleted_at IS NULL
          AND c.status_id = 1
        ORDER BY
          COALESCE(c.priority_seq, 999999) ASC,
          c.updated_at DESC NULLS LAST
        LIMIT 9
      `);

      const campaigns = result.rows.map((row) => normalizeCampaign(row));
      if (campaigns.length > 0) return campaigns;
    } catch (error) {
      console.error('Failed to fetch campaigns from database', error);
    }
  }

  try {
    const apiBaseUrl = process.env.CAMPAIGN_API_URL;
    if (!apiBaseUrl) throw new Error('CAMPAIGN_API_URL is not configured');

    const res = await fetch(`${apiBaseUrl}/api/campaigns/list-external?page=0&size=9&pagination=true`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error('Gagal mengambil data dari API');

    const payload = await res.json();
    const rows = Array.isArray(payload?.data?.rows)
      ? payload.data.rows
      : Array.isArray(payload?.rows)
        ? payload.rows
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    return rows.length > 0 ? rows.map((row: any) => normalizeCampaign(row)) : FALLBACK_CAMPAIGNS;
  } catch {
    return FALLBACK_CAMPAIGNS;
  }
}

function rupiah(value = 0) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

function campaignTarget(campaign: Campaign) {
  return campaign.target_amount || campaign.donation_target || Math.max((campaign.donation_net_amount || 0) * 2, 50_000_000);
}

function campaignImage(campaign: Campaign) {
  return campaign.image_url || campaign.banner_url || campaign.image || FALLBACK_CAMPAIGNS[0].image_url;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; sort?: string };
}) {
  const campaigns = await fetchCampaigns();
  const query = (searchParams?.q || '').trim().toLocaleLowerCase('id-ID');
  const sort = searchParams?.sort || 'default';

  const visibleCampaigns = campaigns
    .filter((campaign) => !query || campaign.title.toLocaleLowerCase('id-ID').includes(query))
    .sort((a, b) => {
      if (sort === 'highest') return (b.donation_net_amount || 0) - (a.donation_net_amount || 0);
      if (sort === 'lowest') return (a.donation_net_amount || 0) - (b.donation_net_amount || 0);
      return 0;
    });

  return (
    <main className="ramadan-page">
      <div className="top-pattern" aria-hidden="true" />
      <div className="gold-arch" aria-hidden="true" />
      <div className="stars" aria-hidden="true" />

      <header className="campaign-header">
        <div className="partner-logos" aria-label="Mitra program">
          <span className="bi-mark">B</span>
          <span className="bi-name">BANK INDONESIA<small>BANK SENTRAL REPUBLIK INDONESIA</small></span>
          <span className="round-logo">SW</span>
          <span className="crest-logo">*</span>
        </div>
        <h1>IKHTIAR RAMADHAN 1447H</h1>
      </header>

      <section className="campaign-content" aria-label="Daftar program wakaf">
        <form className="toolbar" method="get">
          <label className="search-box">
            <span aria-hidden="true">Cari</span>
            <input name="q" defaultValue={searchParams?.q} placeholder="Pencarian" aria-label="Cari program wakaf" />
          </label>
          <label className="sort-box">
            <span aria-hidden="true">Urut</span>
            <select name="sort" defaultValue={sort} aria-label="Urutkan program">
              <option value="default">Urutkan</option>
              <option value="highest">Donasi tertinggi</option>
              <option value="lowest">Donasi terendah</option>
            </select>
          </label>
          <button type="submit">Terapkan</button>
        </form>

        {visibleCampaigns.length ? (
          <div className="campaign-grid">
            {visibleCampaigns.map((campaign) => {
              const collected = campaign.donation_net_amount || 0;
              const target = campaignTarget(campaign);
              const progress = Math.min(100, Math.round((collected / target) * 100));
              const completed = collected >= target;
              const image = campaignImage(campaign);
              const location = campaign.city_name || campaign.location || 'Indonesia';
              const institution = campaign.lembaga_name || campaign.short_description || 'SatuWakaf Indonesia';

              return (
                <Fragment key={campaign.id}>
                  <article className="campaign-card">
                    <a className="campaign-image" href={`#wakaf-${campaign.id}`} aria-label={`Wakaf untuk ${campaign.title}`}>
                      <img src={image} alt={campaign.title} />
                      <span className="play-button" aria-hidden="true">Buka</span>
                    </a>
                    <div className="card-body">
                      <div className="card-tags">
                        <span>Wakaf</span>
                        <span>Abadi</span>
                        <small>{location}</small>
                      </div>
                      <h2>{campaign.title}</h2>
                      <p className="institution">{institution} <b>OK</b></p>
                      <div className="progress-track" aria-label={`Progres ${progress}%`}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <div className="amount-row">
                        <strong>{rupiah(collected)}</strong>
                        <span>tak terbatas</span>
                      </div>
                      <div className="target-row">
                        <small>dari target <b>{rupiah(target)}</b></small>
                        <a href={`#wakaf-${campaign.id}`} className={completed ? 'completed' : ''}>
                          {completed ? 'Tercapai' : 'Yuk Wakaf'}
                        </a>
                      </div>
                    </div>
                  </article>

                  <div id={`wakaf-${campaign.id}`} className="wakaf-modal" role="dialog" aria-modal="true" aria-labelledby={`wakaf-title-${campaign.id}`}>
                    <a className="wakaf-backdrop" href="#" aria-label="Tutup formulir wakaf" />
                    <div className="wakaf-panel">
                      <a className="modal-close" href="#" aria-label="Tutup">x</a>
                      <div className="modal-hero">
                        <img src={image} alt="" />
                        <div>
                          <span>Program Wakaf</span>
                          <h2 id={`wakaf-title-${campaign.id}`}>{campaign.title}</h2>
                          <p>{institution} - {location}</p>
                        </div>
                      </div>

                      <form className="wakaf-form">
                        <label className="amount-field">
                          <span>Nominal Wakaf</span>
                          <div>
                            <strong>Rp</strong>
                            <input inputMode="numeric" name="amount" placeholder="0" aria-label="Nominal Wakaf" />
                          </div>
                          <small>Nominal Wakaf minimal Rp 10.000</small>
                        </label>

                        <label>
                          Nama Anda <b>*</b>
                          <input name="name" placeholder="Masukkan Nama Anda" required />
                        </label>

                        <label>
                          No. HP Anda (Opsional)
                          <input name="phone" placeholder="08..." />
                        </label>

                        <label>
                          Email Anda (Opsional)
                          <input name="email" type="email" placeholder="Masukkan email anda" />
                        </label>

                        <div className="switch-row">
                          <label><input type="checkbox" /> <span>Sembunyikan nama saya dari publikasi (Daftar Wakif)</span></label>
                          <label><input type="checkbox" /> <span>Wakaf untuk orang lain</span></label>
                        </div>

                        <div className="terms">
                          <p><b>1. Tujuan Pengumpulan:</b> memastikan profil wakif dapat diverifikasi dengan informasi yang valid agar syarat sah berwakaf terpenuhi.</p>
                          <p><b>2. Komitmen:</b> data pribadi dikelola dan dijaga sesuai aturan perlindungan data yang berlaku.</p>
                        </div>

                        <label>
                          Doa & Harapan (Opsional)
                          <textarea name="prayer" placeholder="Tuliskan doa & harapan anda" />
                        </label>

                        <div className="payment-box">
                          <strong>Pilih Metode Pembayaran</strong>
                          <div className="payment-options">
                            <label><input type="radio" name="payment" /> Transfer Bank</label>
                            <label><input type="radio" name="payment" /> QRIS</label>
                            <label><input type="radio" name="payment" /> Virtual Account</label>
                          </div>
                        </div>

                        <button type="button" className="submit-wakaf">Lanjutkan Wakaf</button>
                      </form>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">Program yang Anda cari belum ditemukan.</div>
        )}
      </section>

      <div className="mosque-silhouette" aria-hidden="true" />
      <div className="foreground-hills" aria-hidden="true" />
      <div className="corner-decor corner-left" aria-hidden="true">C</div>
      <div className="corner-decor corner-right" aria-hidden="true">*</div>
    </main>
  );
}
