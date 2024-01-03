import Footer from '@/components/Footer';
import PrzelewBankowy from '@/components/payments/PrzelewBankowy';
import type { Metadata } from 'next'
import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Płatność Przelewem • DailyRPG'
};

export default function Przelew() {
  return (
   <>
    <main className="flex flex-col items-center justify-between" >
      <PrzelewBankowy />
      <Footer />
    </main>
   </>
  )
}