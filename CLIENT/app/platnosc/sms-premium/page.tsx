import Footer from '@/components/Footer';
import SmsPayment from '@/components/payments/Sms';
import type { Metadata } from 'next'
import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Płatność SMS • DailyRPG'
};

export default function Sms() {
  return (
   <>
    <main className="flex flex-col items-center justify-between" >
      <SmsPayment />
      <Footer />
    </main>
   </>
  )
}