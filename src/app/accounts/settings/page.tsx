import { Switch } from "@/components/Switch";

export default function Settings() {
    return (
        <section>
            <div className="p-5 space-y-5">
                <div className="border-b pb-3 w-full">
                    <div className="inline-flex items-center justify-between w-full">
                        <h1 className="text-sm">Bersedia dihubungi</h1>
                        <Switch />
                    </div>
                    <p className="text-xs text-gray-500">Saya berseda dihubungi oleh lembaga pembuat program</p>
                </div>
                <div className="border-b pb-3 w-full">
                    <div className="inline-flex items-center justify-between w-full">
                        <h1 className="text-sm">Sembunyikan nama saya</h1>
                        <Switch />
                    </div>
                    <p className="text-xs text-gray-500">Sedekah atas nama Hamba Allah</p>
                </div>
            </div>
        </section>
    )
}
