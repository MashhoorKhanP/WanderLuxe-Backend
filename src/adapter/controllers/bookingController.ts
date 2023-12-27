import { Request, Response } from "express";
import BookingUseCase from "../../useCases/bookingUseCase";

class BookingController {
  private BookingUseCase: BookingUseCase;

  constructor(BookingUseCase: BookingUseCase) {
    this.BookingUseCase = BookingUseCase;
  }

  async payment(req: Request, res: Response) {
    try {
      req.app.locals.booking = req.body;
      const payment= await this.BookingUseCase.payment(req.body);
      if (payment) {
        return res.status(payment.status).json({
          success: true,
          result: { ...payment.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async webhook(req: Request, res: Response) {
    try {
      const localData = req.app.locals.booking;
      console.log('req.body of webhook',req.body);
      
      let transactionId;
      let receiptUrl;
      if(req.body.type === 'charge.succeeded'){

        transactionId = req.body.data.object.payment_intent;
        receiptUrl = req.body.data.object.receipt_url;
  
        console.log('transactionId', transactionId,'receiptUrl',receiptUrl)
      }
      const confirmPayment= await this.BookingUseCase.confirmPayment(req as any);
      if (confirmPayment) {
        const booking = await this.BookingUseCase.bookRoom(localData,transactionId,receiptUrl);
        return res.status(booking.status).json({
          success: true,
          result: { ...booking.data },
        });
      } else {
        res.status(400).json({ success: false, result: {} });
      }
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getBookings(req: Request, res: Response) {
    try {
      const bookings = await this.BookingUseCase.getBookings();
      res.status(bookings.status).json({
        success: true,
        result: { ...bookings.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const bookings = await this.BookingUseCase.getUserBookings(userId);
      res.status(bookings.status).json({
        success: true,
        result: { ...bookings.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }


  async updateBooking(req: Request, res: Response) {
    try {
      const bookingId = req.params.bookingId;
      const updatedBooking = await this.BookingUseCase.updateBooking(
        bookingId,
        req.body
      );
      res.status(200).json({
        success: true,
        result: { ...updatedBooking.data },
      });
    } catch (error) {
      const typedError = error as Error;
      res.status(400).json({ success: false, error: typedError.message });
    }
  }

  
}

export default BookingController;
