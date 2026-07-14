"use client"

import { Button } from "@/components/Button"
import { Form } from "@/components/Form"
import { Header } from "@/components/Header"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import Separtor from "@/components/Separtor"
import { notifyError, notifySuccess } from "@/components/Toaster"
import { env } from "@/lib/env"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { z } from "zod"

export default function Reset() {
		const router = useRouter();

    const InputForm = () => {

        const FormSchema = z.object({
            email: z.string().min(2, {
                message: "error messages.",
            }),
        })

        const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
        })

        async function onSubmit(data: z.infer<typeof FormSchema>) {
            try {
                await axios.post(`${env.NEXT_PUBLIC_BASE_URL}/donors/password/reset`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => {
                    if (response.status === 200) {
                        notifySuccess('Email reset password berhasil dikirim')
                    }
                    setTimeout(() => {
                        router.push("/accounts")
                    }, 800)
                }).catch(fallback => {
                    const { error } = fallback.response.data
                    notifyError(error.id)
                })
            } catch (error) {
                throw Error
            }
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className=" border rounded-lg">
                        <div className="space-y-2 border-b p-3">
                            <Label className="text-gray-500">Email</Label>
                            <Input placeholder="Masukkan nomor ponsel atau email" {...form.register('email')} />
                        </div>
                    </div>
                    <Button className="w-full" variant='blue' type="submit">Kirim Link Reset Password</Button>
                </form>
            </Form>
        )
    }

    return (
        <div>
            <Header title="Reset Password" className="left-0 top-0" />
            <section className="p-5 space-y-2">
                <div className="space-y-1 mb-3">
                    <h1 className="text-base font-bold">Atur Ulang Password</h1>
                    <p className="text-sm text-gray-500">Masukkan email yang terdaftar. Kami akan mengirimkan link verifikasi untuk mengatur ulang kata santi.</p>
                </div>
                <InputForm />
            </section>
            <Separtor />
            <section className="p-5">
                <h1 className="text-center text-sm font-medium w-full text-gray-500">Ingat password ? <Link href='/login' className="text-secondary-500">Masuk sekarang</Link></h1>
            </section>
            <Toaster position='bottom-center' />
        </div>
    )
}


