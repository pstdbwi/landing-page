"use client"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Input } from "@/components/Input";
import { useState } from "react";
import { IcEye } from "@/components/Icon/svg";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { notifyError, notifySuccess } from "@/components/Toaster";
import axios from "axios";
import { getCookie } from "cookies-next";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { ScreenLoader } from "@/components/Loader";
import { Toaster } from "react-hot-toast";
export default function ResetPassword() {
    const [loading, setLoading] = useState<boolean>(false)
    const [seePassword, setSeePassword] = useState<boolean>(false)
    const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false)
    const router = useRouter()
    const FormSchema = z.object({
        password: z.string().min(1, {
            message: 'kata sandi harus diisi'
        }),
        new_password: z.string().min(1, {
            message: 'kata sandi harus diisi'
        }),
        new_confirm_password: z.string().min(1, {
            message: 'kata sandi harus diisi'
        }),
    }).refine((data) => data.new_password === data.new_confirm_password, {
        message: 'password tidak sama',
        path: ["new_confirm_password"],
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: '',
            new_password: '',
            new_confirm_password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true)
        const body = {
            password: data.new_password,
            confirm_password: data.new_confirm_password,
        }
        try {
            await axios.put(`${env.NEXT_PUBLIC_BASE_URL}/donors`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + getCookie('user_token')
                }
            }).then(response => {
                if (response.status === 200) {
                    setLoading(false)
                    notifySuccess('berhasil ubah kata sandi')
                    setTimeout(() => {
                        router.push('/accounts')
                    }, 500)
                }
            }).catch(fallback => {
                const { error } = fallback.response.data
                setLoading(false)
                notifyError(error.id)
            })
        } catch (error) {
            setLoading(false)
            throw Error
        }
    }

    return (
        <section className="p-5 relative">
            <Header className="left-0 top-0" title="Ubah Kata Sandi" />
            <h1 className="font-bold text-base mb-3">Masukkan kata sandi lama dan kata sandi baru kamu</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="border rounded-lg p-3">
                                <FormLabel>Kata sandi lama</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="Kata sandi lama" type={seePassword ? 'text' : 'password'} {...field} />
                                        <button onClick={(e) => {
                                            e.preventDefault()
                                            setSeePassword(!seePassword)
                                        }} className="absolute right-3 h-full bottom-0">
                                            <IcEye />
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="inline-flex justify-end w-full items-end">
                        <Link href='/accounts/reset-password' className="text-secondary-500 text-sm mt-4">Lupa kata sandi?</Link>
                    </div>
                    <div className="border rounded-lg mt-8">
                        <FormField
                            control={form.control}
                            name='new_password'
                            render={({ field }) => (
                                <FormItem className="border-b p-3">
                                    <FormLabel>Kata sandi baru*</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Kata sandi baru*" type={seePassword ? 'text' : 'password'} {...field} />
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setSeePassword(!seePassword)
                                            }} className="absolute right-3 h-full bottom-0">
                                                <IcEye />
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='new_confirm_password'
                            render={({ field }) => (
                                <FormItem className="p-3">
                                    <FormLabel>Konfirmasi Kata sandi</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Konfirmasi Kata sandi" type={seeConfirmPassword ? 'text' : 'password'} {...field} />
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setSeeConfirmPassword(!seeConfirmPassword)
                                            }} className="absolute right-3 h-full bottom-0">
                                                <IcEye />
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" variant='blue' className="w-full mt-4">Ubah kata sandi</Button>
                </form>
            </Form>
            {loading ? <ScreenLoader /> : null}
            <Toaster position='bottom-center' />
        </section>
    )
}