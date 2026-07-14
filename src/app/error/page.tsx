import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
    title: 'Error',
};

export default function Error() {
    return (
        <section className='layout min-h-screen relative bg-white pb-16'>
            <div className='flex min-h-screen flex-col items-center justify-center text-center text-black'>
                <h1 className='mt-8 text-2xl md:text-3xl'>Terjadi Kesalahan</h1>
                <a href='/login'>Kembali</a>
            </div>
        </section>
    );
}