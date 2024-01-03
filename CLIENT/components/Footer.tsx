"use client"

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
    return (
        <>
            <motion.div className="flex justify-center mt-[150px]" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex md:justify-between justify-center md:mb-auto mb-5 md:flex-row flex-col md:w-[950px] w-[350px]">
                    <div>
                        <p>NIP: <b>0000000000</b></p>
                        <p>REGON: <b>000000000</b></p>
                    </div>
                    <div>
                        <p>Wykonanie: <Link href="https://mid-dev.pl?ref=dailyrpg.pl"><b>MID-DEV</b></Link></p>
                    </div>
                    <div>
                        <p>Płatności obsługuję: <b className="text-blue-500"><Link href="https://paybylink.pl">PayByLink</Link></b></p>
                        <p className="text-gray-300"><Link href="https://dailymta.pl/regulamin.pdf">Regulamin płatności</Link></p>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Footer;