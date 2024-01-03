import Footer from '@/components/Footer';
import SelectMethod from '@/components/SelectMethod';
import Navbar from '@/components/SelectMethod'
import type { Metadata } from 'next'
import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sklep • DailyRPG'
};

export default function Home() {
  return (
   <>
    <main className="flex flex-col items-center justify-between" >
      <SelectMethod />
      <Footer />
    </main>
   </>
  )
}