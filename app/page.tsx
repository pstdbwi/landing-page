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

async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const apiBaseUrl = process.env.CAMPAIGN_API_URL || 'http://localhost:3003';
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

    return rows.length > 0 ? rows : FALLBACK_CAMPAIGNS;
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
          <span className="crest-logo">✦</span>
        </div>
        <h1>IKHTIAR RAMADHAN 1447H</h1>
      </header>

      <section className="campaign-content" aria-label="Daftar program wakaf">
        <form className="toolbar" method="get">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input name="q" defaultValue={searchParams?.q} placeholder="Pencarian" aria-label="Cari program wakaf" />
          </label>
          <label className="sort-box">
            <span aria-hidden="true">⇅</span>
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

              return (
                <article key={campaign.id} className="campaign-card">
                  <div className="campaign-image">
                    <img
                      src={campaign.image_url || campaign.banner_url || campaign.image || FALLBACK_CAMPAIGNS[0].image_url}
                      alt={campaign.title}
                    />
                    <span className="play-button" aria-hidden="true">▶</span>
                  </div>
                  <div className="card-body">
                    <div className="card-tags">
                      <span>Wakaf</span>
                      <span>Abadi</span>
                      <small>⌖ {campaign.city_name || campaign.location || 'Indonesia'}</small>
                    </div>
                    <h2>{campaign.title}</h2>
                    <p className="institution">{campaign.lembaga_name || campaign.short_description || 'SatuWakaf Indonesia'} <b>◉</b></p>
                    <div className="progress-track" aria-label={`Progres ${progress}%`}>
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className="amount-row">
                      <strong>{rupiah(collected)}</strong>
                      <span>∞</span>
                    </div>
                    <div className="target-row">
                      <small>dari target <b>{rupiah(target)}</b></small>
                      <a href={`#wakaf-${campaign.id}`} className={completed ? 'completed' : ''}>
                        {completed ? '◉ Tercapai' : 'Yuk Wakaf →'}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">Program yang Anda cari belum ditemukan.</div>
        )}
      </section>

      <div className="mosque-silhouette" aria-hidden="true" />
      <div className="foreground-hills" aria-hidden="true" />
      <div className="corner-decor corner-left" aria-hidden="true">☾</div>
      <div className="corner-decor corner-right" aria-hidden="true">✦</div>
    </main>
  );
}
