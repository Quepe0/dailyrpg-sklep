const PaybylinkPayments = require('node-polish-payments');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

exports.checkPromoCode = async (req, res) => {
  const { promo_code } = req.body;

  if (promo_code) {
    const promoCodeResult = await db.query(
      'SELECT percentage FROM promotion_codes WHERE code = ?',
      [promo_code]
    );

    const percentage = promoCodeResult[0][0] ? promoCodeResult[0][0].percentage : null;

    if (percentage !== null) {
      return res.status(200).json({ message: "Kod poprawny", percentage });
    } else {
      return res.status(400).json({ message: "Niepoprawny kod promocyjny" });
    }
  } else {
    return res.status(400).json({ message: "Brak kodu promocyjnego" });
  }
};

exports.przelewPayment = async (req, res) => {
   try {
      const {
         serial,
         amount,
         tos,
         promo_code
      } = req.body;

      if (!serial || !amount) {
         return res.status(400).json({
            message: "Należy wypełnić wszystkie pola!"
         });
      }
  
      const PaybylinkTransfer = PaybylinkPayments.PaybylinkTransfer;
      const PaybylinkGenerateTransferSignature = PaybylinkPayments.PaybylinkGenerateTransferSignature;
      const paybylinkTransfer = new PaybylinkTransfer('Gd2Ww2Ku2Rj1Up4Us5Za4Pb0At1Wf0Nb', 2309);
      const paybylinkSignature = new PaybylinkGenerateTransferSignature('Gd2Ww2Ku2Rj1Up4Us5Za4Pb0At1Wf0Nb', 2309);

      paybylinkTransfer.options.price = amount;
      paybylinkTransfer.options.description = 'Kupno Wirutalnych punktów na serwerze.';
      paybylinkTransfer.options.notifyURL = 'https://sklep.dailymta.pl/api/payment/webhook';
      paybylinkTransfer.returnUrlSuccess = `https://sklep.dailymta.pl/platnosc/pomyslna?serial=${serial}&amount=${amount}&wpln=${amount}`;
      paybylinkSignature.price = amount;
      paybylinkSignature.description = 'Kupno Wirutalnych punktów na serwerze.';
      paybylinkSignature.notifyURL = 'https://sklep.dailymta.pl/api/payment/webhook';
      paybylinkSignature.returnUrlSuccess = `https://sklep.dailymta.pl/platnosc/pomyslna?serial=${serial}&amount=${amount}&wpln=${amount}`;

      const generateSignature = await paybylinkSignature.generateSignature();

      const createTransfer = await paybylinkTransfer.createTransfer();

      const transactionUrl = createTransfer.data.url;
      const transactionId = createTransfer.data.transactionId;
      const formattedDate = moment().format('DD/MM/YYYY HH:mm:ss');

      let additionalPercentage = 0;

      if (promo_code) {
         const promoCodeResult = await db.query(
           'SELECT percentage FROM promotion_codes WHERE code = ?',
           [promo_code]
         );
         const percentage = promoCodeResult[0][0] ? promoCodeResult[0][0].percentage : null;
         additionalPercentage = percentage;
       }
       
      const totalAmount = amount + (amount * additionalPercentage / 100);
      console.log(totalAmount)

       

      return res.status(200).json({
         message: "Pomyślnie utworzono płatność",
         redirect_url: transactionUrl
      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: 'Błąd serwera podczas tworzenia płatności'
      });
   }
};

exports.smsPayment = async (req, res) => {
   try {
      const {
         serial,
         amount,
         number,
         code,
         tos,
         promo_code
      } = req.body;

      if (!serial || !amount || !number || !code) {
         return res.status(400).json({
            message: "Należy wypełnić wszystkie pola!"
         });
      }

      if (!tos) {
         return res.status(400).json({
            message: "Aby kontynuować należy zaakceptować Regulamin!"
         });
      }

      const optionsDetails = [
         {
            value: 2.46,
            number: 72480,
         },
         {
            value: 3.69,
            number: 73480,
         },
         {
            value: 4.92,
            number: 74480,
         },
         {
            value: 6.15,
            number: 75480,
         },
         {
            value: 7.38,
            number: 76480,
         },
         {
            value: 11.07,
            number: 79480,
         },
         {
            value: 23.37,
            number: 91900,
         },
         {
            value: 30.75,
            number: 92521,
         },
      ];

      const selectedOption = optionsDetails.find(option => option.number === parseInt(number, 10));

      if (!selectedOption) {
         return res.status(400).json({
            message: "Wystąpił błąd z numerem. Skontaktuj się z administratorem!"
         });
      }
      
      const expectedValue = parseFloat(selectedOption.value);
      if (parseFloat(amount) !== expectedValue) {
         return res.status(400).json({
            message: `Wykryto próbe oszustwa, Twoja płatność została anulowana!`
         });
      }      

      const discountPercentage = -45;
      const discountedAmount = amount * (1 + discountPercentage / 100);

      const userid = 7709;
      const serviceid = 750;

      const apiUrl = 'https://www.Paybylink.pl/api/v2/index.php';
      const params = {
         userid,
         serviceid,
         code,
         number,
      };

      try {
         const response = await axios.get(apiUrl, { params });
         console.log('Odpowiedź z serwera Paybylink:', response.data);

         const paybylinkResponse = response.data;
         if (paybylinkResponse.connect && paybylinkResponse.data && paybylinkResponse.data.status === 1) {
            const { service, phone, reply } = paybylinkResponse.data;

            let additionalPercentage = 0;

            if (promo_code) {
               const promoCodeResult = await db.query(
                 'SELECT percentage FROM promotion_codes WHERE code = ?',
                 [promo_code]
               );
               const percentage = promoCodeResult[0][0] ? promoCodeResult[0][0].percentage : null;
               additionalPercentage = percentage;
             }

            const totalAmount = discountedAmount + (discountedAmount * additionalPercentage / 100);
            console.log(totalAmount)

            await db.query(
               'UPDATE pystories_users SET wpln = wpln + ? WHERE id = ?',
               [totalAmount, serial]
            );

            const formattedDate = moment().format('DD/MM/YYYY HH:mm:ss');
            await db.query(
               'INSERT INTO paybylink_payments (transaction_id, number, code, serial, wpln, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
               [
                  "TRANSAKCJA SMS",
                  number,
                  code,
                  serial,
                  totalAmount,
                  1,
                  formattedDate
               ]
            );

            return res.status(200).json({
               message: `Pomyślnie opłacono SMS. Punkty WPLN znajdują się na Twoim koncie w grze.`
            });
         } else {
            return res.status(400).json({
               message: 'Błąd płatności. Sprawdź, czy podane dane są poprawne i spróbuj ponownie.',
            });
         }
      } catch (error) {
         console.error('Błąd zapytania do serwera Paybylink:', error.message);
         return res.status(500).json({
            message: 'Błąd serwera podczas komunikacji z Paybylink.',
         });
      }

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: 'Błąd serwera podczas tworzenia płatności'
      });
   }
};

exports.webhookPayment = async (req, res) => {
   try {
      const {
         transactionId,
         amountPaid,
         notificationAttempt,
         paymentType,
         apiVersion,
         signature
      } = req.body;

      console.log("Request Body:", req.body);

      if (
         transactionId &&
         amountPaid &&
         notificationAttempt !== undefined &&
         paymentType &&
         apiVersion &&
         signature
      ) {
         const paybylinkPaymentResult = await db.query(
            'SELECT wpln, serial, status, signature FROM paybylink_payments WHERE transaction_id = ?',
            [transactionId]
         );

         if (paybylinkPaymentResult.length > 0) {
            const currentWpln = parseFloat(paybylinkPaymentResult[0][0]?.wpln) || 0;
            const serialUser = paybylinkPaymentResult[0][0]?.serial;
            const paymentStatus = paybylinkPaymentResult[0][0]?.status;
            const storedSignature = paybylinkPaymentResult[0][0]?.signature;

            if (paymentStatus === 0) {
               if (storedSignature) {
                  if (signature === storedSignature) {

                     const serialUserResult = await db.query(
                        'SELECT wpln FROM pystories_users WHERE id = ?',
                        [serialUser]
                     );

                     if (serialUserResult.length > 0) {
                        const wplnUser = parseFloat(serialUserResult[0]?.wpln) || 0;
                        const totalWpln = wplnUser + currentWpln;

                        await db.query(
                           'UPDATE pystories_users SET wpln = wpln + ? WHERE id = ?',
                           [currentWpln, serialUser]
                        );

                        await db.query(
                           'UPDATE paybylink_payments SET status = ? WHERE transaction_id = ?',
                           [1, transactionId]
                        );

                        return res.status(200).json({
                           message: "Pomyślnie zaktualizowano wpln i zapisano dane płatności"
                        });
                     } else {
                        return res.status(404).json({
                           message: "Nie znaleziono użytkownika o podanym serialu."
                        });
                     }
                  } else {
                     return res.status(400).json({
                        message: "Nieprawidłowy podpis (signature) w żądaniu."
                     });
                  }
               } else {
                  return res.status(400).json({
                     message: "Brak zapisanej sygnatury dla transakcji o podanym transactionId."
                  });
               }
            } else {
               return res.status(400).json({
                  message: "Transakcja o tym transactionId ma już opłacony status."
               });
            }
         } else {
            return res.status(404).json({
               message: "Brak płatności o podanym transactionId."
            });
         }
      } else {
         return res.status(400).json({
            message: "Nieprawidłowe dane płatności. Upewnij się, że wszystkie pola są wypełnione."
         });
      }

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Wystąpił błąd podczas przetwarzania płatności."
      });
   }
}