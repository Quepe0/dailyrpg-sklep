"use client"

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SelectMethod = () => {
  return (
    <>
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <section className="flex justify-center items-center mt-[55px] flex-col">
        <div className="flex flex-col mb-[50px]">
          <Image className="w-[300px]" src="https://i.imgur.com/fDVupef.png" width="500" height="500" alt="DailyRPG - Logo"></Image>
          <p>Wybierz interesującą Cię metodę płatności</p>
        </div>

        <div className="flex md:flex-row flex-col">
          <Link href={"#"}>
              <Card className="md:w-[350px] w-[330px] h-[291px] md:mb-auto mb-5 md:mr-5 mr-auto flex items-center justify-center flex-col cursor-pointer hover:bg-black ease-out duration-300">
              <CardHeader>
                <CardTitle className="text-center">PaySafeCard</CardTitle>
                <CardTitle>(Aktualnie wyłączone)</CardTitle>  
              </CardHeader>
              <CardContent>
                <Image className="w-[200px] filter brightness-0 invert" src="https://i.imgur.com/xce6tHK.png" width="500" height="500" alt="PaySafeCard Logo"></Image>
              </CardContent>
            </Card>
          </Link>

          <Link href={"/platnosc/sms-premium"}>
            <Card className="md:w-[350px] w-[330px] h-[291px] md:mb-auto mb-5 md:mr-5 mr-auto flex items-center justify-center flex-col cursor-pointer hover:bg-black ease-out duration-300">
              <CardHeader>
                <CardTitle>Płatność SMS</CardTitle>
              </CardHeader>
              <CardContent>
                <Image className="w-[200px] filter brightness-0 invert" src="https://i.imgur.com/Fvbix4k.png" width="500" height="500" alt="PaySafeCard Logo"></Image>
              </CardContent>
            </Card>
          </Link>

          <Link href={"/platnosc/przelew-bankowy"}>
            <Card className="md:w-[350px] w-[330px] h-[291px] md:mb-auto mb-5 md:mr-5 mr-auto flex items-center justify-center flex-col cursor-pointer hover:bg-black ease-out duration-300">
              <CardHeader>
                <CardTitle>Przelew online / BLIK</CardTitle>
              </CardHeader>
              <CardContent>
                <Image className="w-[200px] filter brightness-0 invert" src="https://i.imgur.com/e21kOFr.png" width="500" height="500" alt="PaySafeCard Logo"></Image>
              </CardContent>
            </Card>
          </Link>
        </div>

      </section>
    </motion.div>
    </>
  );
};

export default SelectMethod;