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
        success_url: `${process.env.CLIENT_URL}/user/payment-success`,
        cancel_url:`${process.env.CLIENT_URL}/user/payment-failed` , // check ensure here
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

    const endpointSecret = "whsec_82a284623372fed5412eddcdbce9bcfc485e3e1fe3dfac4cc9a7940d9c7f1c81";
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