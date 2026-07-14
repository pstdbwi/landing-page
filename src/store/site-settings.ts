//@ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface siteProps {
    settings: {
        lembaga_name: "",
        theme: "",
        logo: "",
        install_app: true
    },
    setSiteSettings: (settings: any) => void
}
const useSiteSettings = create<siteProps>(persist(
    (set) => ({
        settings: {
            lembaga_name: "",
            theme: "",
            logo: "",
            install_app: true
        },
        setSiteSettings: (settings: any) => set(state => ({ settings: { ...state.settings, ...settings } }))
    }),
    {
        name: 'siteSettings',
    }
));

export default useSiteSettings;
