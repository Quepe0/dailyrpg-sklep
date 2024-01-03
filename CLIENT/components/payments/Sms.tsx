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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Sms = () => {
  const [serial, setSerial] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [smsNumber, setSmsNumber] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [showSmsCodeInput, setShowSmsCodeInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodePercentage, setPromoCodePercentage] = useState(0);

  const optionsDetails = [
    { value: "2.46", number: 72480, content: "ST.DAILYRPG" },
    { value: "3.69", number: 73480, content: "ST.DAILYRPG" },
    { value: "4.92", number: 74480, content: "ST.DAILYRPG" },
    { value: "6.15", number: 75480, content: "ST.DAILYRPG" },
    { value: "7.38", number: 76480, content: "ST.DAILYRPG" },
    { value: "11.07", number: 79480, content: "ST.DAILYRPG" },
    { value: "23.37", number: 91900, content: "ST.DAILYRPG" },
    { value: "30.75", number: 92521, content: "ST.DAILYRPG" },
  ];

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
        setResponseMessage(""); // Clear any previous error messages
      } else {
        setPromoCodePercentage(0); // Reset percentage if promo code is invalid
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
    setPromoCodePercentage(0); // Reset percentage when promo code changes
  };

  const handleSelectMethod = (value: string) => {
    setSelectedOption(value);

    const selectedOptionDetails = optionsDetails.find(opt => opt.value === value);

    if (selectedOptionDetails) {
      setSmsNumber(selectedOptionDetails.number.toString());
      setSmsContent(selectedOptionDetails.content);
    }

    if (promoCode) {
      handleVerifyPromoCode();
    }

    const originalAmount = parseFloat(value);
    const discountPercentage = 0.45; // 40%
    const discountAmount = originalAmount * discountPercentage;
    const finalAmount = originalAmount - discountAmount;

    setDiscountedAmount(finalAmount);
    setShowSmsCodeInput(true);
  };

  const handleChangeTerms = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleCreatePayment = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${config.api_url}/payment/create/sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serial,
            amount: parseFloat(selectedOption),
            number: smsNumber,
            code: smsCode,
            tos: termsAccepted,
            promo_code: promoCode
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setResponseMessage(data.message);
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
        <section className="flex justify-center items-center mt-[5px] flex-col">
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
                <CardTitle>Doładowanie SMS</CardTitle>
                <CardDescription>
                  Wypełnij poniższy formularz aby doładować WPLN przy pomocy
                  SMSa.
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
                    Wybierz kwote przelewu
                  </Label>
                  <Select onValueChange={handleSelectMethod}>
                    <SelectTrigger>
                        <SelectValue placeholder="Wybierz kwote" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="2.46">2.46 PLN</SelectItem>
                        <SelectItem value="3.69">3.69 PLN</SelectItem>
                        <SelectItem value="4.92">4.92 PLN</SelectItem>
                        <SelectItem value="6.15">6.15 PLN</SelectItem>
                        <SelectItem value="7.38">7.38 PLN</SelectItem>
                        <SelectItem value="11.07">11.07 PLN</SelectItem>
                        <SelectItem value="23.37">23.37 PLN</SelectItem>
                        <SelectItem value="30.75">30.75 PLN</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                   </Select>
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
                {showSmsCodeInput && (
                <div>
                    <Label className="ml-1" htmlFor="smsCode">Wpisz kod SMS</Label>
                    <Input type="text" id="smsCode" placeholder="Kod SMS" onChange={(e) => setSmsCode(e.target.value)} />
                </div>
                )}
                <div className="mt-1">
                    {selectedOption && (
                        <p>Wyślij SMS na numer: <b>{smsNumber}</b> O Treści: <b>{smsContent}</b></p>
                    )}
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
                        {(
                          discountedAmount + discountedAmount * (promoCodePercentage / 100)
                        ).toFixed(2)}{" "}
                        WPLN
                      </b>
                    </p>
                  </div>
                  {termsAccepted}
                </div>
                <div className="mt-3">
                  <Button onClick={handleCreatePayment} className={`${loading ? 'cursor-not-allowed w-full text-white' : 'w-full text-white'}`}>Złóż zamówienie</Button>
                  <p className="ml-1 relative">{responseMessage}<b className="hidden">e</b></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Sms;