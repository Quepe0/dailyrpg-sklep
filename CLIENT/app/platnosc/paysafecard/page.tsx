import Footer from '@/components/Footer';
import Paysafecard from '@/components/payments/Paysafecard';
import type { Metadata } from 'next'
import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Płatność PaySafeCard • DailyRPG'
};

export default function Psc() {
  return (
   <>
    <main className="flex flex-col items-center justify-between" >
      <Paysafecard />
      <Footer />
    </main>
   </>
  )
}