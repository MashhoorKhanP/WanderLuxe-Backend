import Stripe from "stripe";
import dotenv from 'dotenv'
import IBooking from "../../domain/entities/booking";
dotenv.config();

const stripeSecretKey = process.env.STRIPE_KEY;

if (!stripeSecretKey){
  throw new Error("Stripe secret key is not defined");
}

const stripe  = new Stripe(stripeSecretKey);

class PaymentRepository {
  
  async confirmPayment(bookingData:IBooking) {
    const {firstName,lastName,email,
    mobile,
    userId,
    roomType,
    hotelName,
    roomImage,
    roomId,
    adults,
    children,
    couponDiscount,
    totalRoomsCount,
    appliedCouponId,
    checkInDate,
    checkOutDate,
    checkInTime,
    checkOutTime,
    numberOfNights,
    totalAmount} = bookingData;
    console.log('bookingData', bookingData);
      const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: roomType,
                images:[roomImage],
                description:`Thanks for booking ${roomType} room at ${hotelName},Check-in on ${checkInDate}-${checkInTime
                } and Check-out on ${checkOutDate}-${checkOutTime}.`,
                metadata:{
                  roomId,
                  userId
                }
              },
              unit_amount: totalAmount*100,
            },
            
            quantity: 1,
          },
          
        ],
        billing_address_collection: 'required',
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url:`${process.env.CLIENT_URL}/payment-failed` , // check ensure here
      });

      console.log('session',session)
      // res.status(200).json({
      //   success: true,
      //   result: {...session},
      // });
      return session;
  }

  async confirmAddMoneyToWalletPayment(addMoneyToWalletData:any) {
    const {userId,amount} = addMoneyToWalletData;
    console.log('addMoneyToWalletData', addMoneyToWalletData);
      const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'Add Money To Wallet',
                images:['https://partner.visa.com/content/dam/gpp/homepage/card-lab-header-v2-2x.png'],
                description:`An amount of ₹${amount} will be credited to your wallet after this payment.`,
                metadata:{
                  userId
                }
              },
              unit_amount: amount*100,
            },
            
            quantity: 1,
          },
          
        ],
        billing_address_collection: 'required',
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url:`${process.env.CLIENT_URL}/payment-failed` , // check ensure here
      });

      console.log('session',session)
      // res.status(200).json({
      //   success: true,
      //   result: {...session},
      // });
      return session;
  }
  
  async paymentSuccess(request:any){
    // console.log('request',request.body)
    const payload = request.body;
    const payloadString = JSON.stringify(payload,null,2);
    const signature = request.headers["stripe-signature"];

    if(typeof signature !== "string"){
      return false;
    }

    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;
    const header = stripe.webhooks.generateTestHeaderString({
      payload:payloadString,
      secret:endpointSecret
    });

    let event;
    event = stripe.webhooks.constructEvent(
      payloadString,
      header,
      endpointSecret
    )
    // console.log('Webhook verified', event)
    if(event.type == 'charge.succeeded'){
      return true;
    }else{
      return false;
    }
  }

  async addMoneyToWalletPaymentSuccess(request:any){
    // console.log('request',request.body)
    const payload = request.body;
    const payloadString = JSON.stringify(payload,null,2);
    const signature = request.headers["stripe-signature"];

    if(typeof signature !== "string"){
      return false;
    }

    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;
    const header = stripe.webhooks.generateTestHeaderString({
      payload:payloadString,
      secret:endpointSecret
    });

    let event;
    event = stripe.webhooks.constructEvent(
      payloadString,
      header,
      endpointSecret
    )
    // console.log('Webhook verified', event)
    if(event.type == 'charge.succeeded'){
      return true;
    }else{
      return false;
    }
  }
}

export default PaymentRepository;