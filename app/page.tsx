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
    id: 'fallback-1',
    title: 'Wakaf Sumur Air Bersih untuk Pesantren',
    short_description: 'Program wakaf air bersih untuk mendukung kegiatan santri dan masyarakat sekitar.',
    image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=85',
    donation_net_amount: 80_000_000,
    donation_target: 120_000_000,
    lembaga_name: 'SatuWakaf Indonesia',
    city_name: 'Indonesia',
  },
  {
    id: 'fallback-2',
    title: 'Wakaf Pendidikan untuk Generasi Qurani',
    short_description: 'Dukung sarana belajar dan pembinaan penghafal Al-Quran.',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85',
    donation_net_amount: 62_775_000,
    donation_target: 100_000_000,
    lembaga_name: 'Bank Indonesia Peduli',
    city_name: 'Jakarta',
  },
  {
    id: 'fallback-3',
    title: 'Wakaf Produktif Budidaya Pangan untuk Santri',
    short_description: 'Wakaf produktif untuk kemandirian pesantren dan pemberdayaan ekonomi umat.',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85',
    donation_net_amount: 100_050_000,
    donation_target: 180_000_000,
    lembaga_name: 'Mitra Wakaf',
    city_name: 'Bengkulu',
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
  const locationCity = typeof row.location === 'object' ? row.location?.city : undefined;

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
    city_name: row.city_name || locationCity || row.city?.name,
    location: typeof row.location === 'string' ? row.location : locationCity,
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

function progressPercent(campaign: Campaign) {
  const collected = campaign.donation_net_amount || 0;
  const target = campaignTarget(campaign);
  return Math.min(100, Math.round((collected / target) * 100));
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

  const featured = visibleCampaigns[0] || FALLBACK_CAMPAIGNS[0];
  const featuredImage = campaignImage(featured);
  const featuredLocation = featured.city_name || featured.location || 'Indonesia';
  const totalCollected = visibleCampaigns.reduce((sum, campaign) => sum + (campaign.donation_net_amount || 0), 0);

  return (
    <main className="landing-page">
      <section className="hero-section">
        <nav className="top-nav" aria-label="Navigasi utama">
          <a href="#" className="brand-mark">
            <span>SW</span>
            <strong>SatuWakaf</strong>
          </a>
          <div className="nav-pill">Ikhtiar Ramadhan 1447H</div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Platform Wakaf Pilihan</span>
            <h1>Temukan program wakaf yang nyata, terukur, dan siap didukung hari ini.</h1>
            <p>
              Setiap campaign ditarik dari database dan endpoint yang tersambung, termasuk gambar,
              nominal terkumpul, lokasi, dan lembaga pengelola.
            </p>
            <div className="hero-actions">
              <a href="#program-wakaf" className="primary-action">Lihat Program</a>
              <a href={`#wakaf-${featured.id}`} className="secondary-action">Wakaf Unggulan</a>
            </div>
            <div className="stat-strip" aria-label="Ringkasan program">
              <div>
                <strong>{visibleCampaigns.length}</strong>
                <span>Program tampil</span>
              </div>
              <div>
                <strong>{rupiah(totalCollected)}</strong>
                <span>Total terkumpul</span>
              </div>
              <div>
                <strong>30 detik</strong>
                <span>Data diperbarui</span>
              </div>
            </div>
          </div>

          <a className="featured-card" href={`#wakaf-${featured.id}`} aria-label={`Wakaf untuk ${featured.title}`}>
            <img src={featuredImage} alt={featured.title} />
            <div className="featured-overlay">
              <span>Program Unggulan</span>
              <h2>{featured.title}</h2>
              <p>{featured.lembaga_name || featured.short_description || 'SatuWakaf Indonesia'} - {featuredLocation}</p>
              <div className="featured-progress">
                <span style={{ width: `${progressPercent(featured)}%` }} />
              </div>
              <strong>{rupiah(featured.donation_net_amount || 0)}</strong>
            </div>
          </a>
        </div>
      </section>

      <section id="program-wakaf" className="campaign-section" aria-label="Daftar program wakaf">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Program Tersedia</span>
            <h2>Pilih campaign wakaf</h2>
          </div>
          <form className="toolbar" method="get">
            <label className="search-box">
              <span>Cari</span>
              <input name="q" defaultValue={searchParams?.q} placeholder="Judul campaign" aria-label="Cari program wakaf" />
            </label>
            <label className="sort-box">
              <span>Urutkan</span>
              <select name="sort" defaultValue={sort} aria-label="Urutkan program">
                <option value="default">Terbaru</option>
                <option value="highest">Donasi tertinggi</option>
                <option value="lowest">Donasi terendah</option>
              </select>
            </label>
            <button type="submit">Terapkan</button>
          </form>
        </div>

        {visibleCampaigns.length ? (
          <div className="campaign-grid">
            {visibleCampaigns.map((campaign) => {
              const collected = campaign.donation_net_amount || 0;
              const target = campaignTarget(campaign);
              const progress = progressPercent(campaign);
              const completed = collected >= target;
              const image = campaignImage(campaign);
              const location = campaign.city_name || campaign.location || 'Indonesia';
              const institution = campaign.lembaga_name || campaign.short_description || 'SatuWakaf Indonesia';

              return (
                <Fragment key={campaign.id}>
                  <article className="campaign-card">
                    <a className="campaign-image" href={`#wakaf-${campaign.id}`} aria-label={`Wakaf untuk ${campaign.title}`}>
                      <img src={image} alt={campaign.title} />
                      <span className="image-badge">Buka</span>
                    </a>
                    <div className="card-body">
                      <div className="card-tags">
                        <span>Wakaf</span>
                        <small>{location}</small>
                      </div>
                      <h3>{campaign.title}</h3>
                      <p className="institution">{institution}</p>
                      <div className="progress-track" aria-label={`Progres ${progress}%`}>
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <div className="amount-row">
                        <div>
                          <small>Terkumpul</small>
                          <strong>{rupiah(collected)}</strong>
                        </div>
                        <span>{progress}%</span>
                      </div>
                      <div className="target-row">
                        <small>Target {rupiah(target)}</small>
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
                          <span>Wakaf Sekarang</span>
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

                        <div className="form-grid">
                          <label>
                            Nama Anda <b>*</b>
                            <input name="name" placeholder="Masukkan nama anda" required />
                          </label>
                          <label>
                            No. HP Anda
                            <input name="phone" placeholder="08..." />
                          </label>
                        </div>

                        <label>
                          Email Anda
                          <input name="email" type="email" placeholder="Masukkan email anda" />
                        </label>

                        <div className="switch-row">
                          <label><input type="checkbox" /> <span>Sembunyikan nama saya dari publikasi</span></label>
                          <label><input type="checkbox" /> <span>Wakaf untuk orang lain</span></label>
                        </div>

                        <div className="terms">
                          <p><b>1. Tujuan Pengumpulan:</b> memastikan profil wakif dapat diverifikasi dengan informasi yang valid.</p>
                          <p><b>2. Komitmen:</b> data pribadi dikelola sesuai aturan perlindungan data yang berlaku.</p>
                        </div>

                        <label>
                          Doa dan Harapan
                          <textarea name="prayer" placeholder="Tuliskan doa dan harapan anda" />
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
    </main>
  );
}
