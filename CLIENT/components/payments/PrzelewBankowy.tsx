"use client";

import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import config from "@/components/config.json";

const PrzelewBankowy = () => {
  const [serial, setSerial] = useState("");
  const [amount, setAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodePercentage, setPromoCodePercentage] = useState(0);

  const handleChangeTerms = () => {
    setTermsAccepted(!termsAccepted);
  };

  useEffect(() => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount)) {
      setCalculatedAmount(numericAmount + numericAmount * promoCodePercentage / 100);
    }
  }, [amount, promoCodePercentage]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    const parsedValue = parseInt(newValue, 10);

    if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 9999) {
      setAmount(parsedValue.toString());
      setCalculatedAmount(parsedValue + parsedValue * promoCodePercentage / 100);
    }
  };

  const handleVerifyPromoCode = async () => {
    try {
      const response = await fetch(`${config.api_url}/payment/promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promo_code: promoCode,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setPromoCodePercentage(data.percentage);
        setResponseMessage("");
      } else {
        setPromoCodePercentage(0);
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error("Error verifying promo code: ", error);
      setPromoCodePercentage(0);
      setResponseMessage("Wystąpił błąd podczas weryfikacji kodu promocyjnego.");
    }
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    setPromoCodePercentage(0);
  };

  const handleCreatePayment = async () => {
    try {
      setLoading(true);

      if (promoCode) {
        await handleVerifyPromoCode();
      }

      const response = await fetch(
        `${config.api_url}/payment/create/przelew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serial,
            amount: parseFloat(amount),
            tos: termsAccepted,
            promo_code: promoCode
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setResponseMessage(data.message);
        window.location.href = `${data.redirect_url}`;
      } else {
        setResponseMessage(data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      setResponseMessage("Wystąpił błąd podczas przetwarzania żądania.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <section className="flex justify-center items-center mt-[15px] flex-col">
          <div className="flex flex-col mb-[50px]">
          <Link href="/">
                <Image
                className="w-[300px]"
                src="https://i.imgur.com/fDVupef.png"
                width="500"
                height="500"
                alt="DailyRPG - Logo"
                ></Image>
            </Link>
          </div>
          <div className="flex">
            <Card className="md:w-[500px] w-[360px]">
              <CardHeader>
                <CardTitle>Doładowanie Przelewem</CardTitle>
                <CardDescription>
                  Wypełnij poniższy formularz aby doładować WPLN przy pomocy
                  Przelewu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <Label className="ml-1" htmlFor="email">
                    Numer seryjny konta ( Znajdziesz pod F1 w grze)
                  </Label>
                  <Input
                    type="name"
                    id="serial"
                    placeholder="DBID Konta"
                    onChange={(e) => setSerial(e.target.value)}
                  ></Input>
                </div>
                <div className="mb-3">
                  <Label className="ml-1" htmlFor="amount">
                    Wprowadź kwotę przelewu
                  </Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Kwota przelewu"
                    value={Math.min(
                      Math.max(parseInt(amount), 1),
                      9999
                    ).toString()}
                    onChange={handleAmountChange}
                  ></Input>
                </div>
                <div className="mb-3">
                  <Label className="ml-1" htmlFor="email">
                    Kod Promocyjny ( Nie wymagane )
                  </Label>
                  <div className="flex justfiy-between">
                  <Input
                    type="name"
                    id="promo"
                    placeholder="Kod Promocyjny"
                    
                    onChange={handlePromoCodeChange}
                  ></Input>
                  <Button onClick={handleVerifyPromoCode} className="ml-2">
                    Sprawdź
                  </Button>
                  </div>
                </div>
                <div className="flex justify-between mt-[30px] md:flex-row flex-col">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" onClick={handleChangeTerms} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Akceptuję regulamin usługi
                    </label>
                  </div>
                  <div>
                  <p>
                    Otrzymasz:{" "}
                    <b>
                      {calculatedAmount.toFixed(2)} WPLN
                    </b>
                  </p>
                </div>
                  {termsAccepted}
                </div>
                <div className="mt-3">
                  <Button onClick={handleCreatePayment} className={`${loading ? 'cursor-not-allowed w-full text-white' : 'w-full text-white'}`}>Złóż zamówienie</Button>
                  <p className="ml-1 relative">{responseMessage}<b className="hidden">es</b></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default PrzelewBankowy;