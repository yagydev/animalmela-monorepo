const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create Razorpay order
  async createOrder(orderData) {
    try {
      const options = {
        amount: orderData.amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: orderData.orderId,
        payment_capture: 1,
        notes: {
          buyerId: orderData.buyerId,
          farmerId: orderData.farmerId,
          description: orderData.description || 'Farm produce purchase'
        }
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment signature
  verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;
      
      return {
        success: isValid,
        message: isValid ? 'Payment verified successfully' : 'Payment verification failed'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Capture payment
  async capturePayment(paymentId, amount) {
    try {
      const capture = await this.razorpay.payments.capture(
        paymentId,
        amount * 100,
        'INR'
      );
      
      return {
        success: true,
        capture
      };
    } catch (error) {
      console.error('Payment capture failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount, reason = 'Refund requested') {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: amount * 100,
        notes: {
          reason: reason
        }
      });

      return {
        success: true,
        refund
      };
    } catch (error) {
      console.error('Refund failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate UPI payment link
  generateUPILink(amount, description, merchantId) {
    const upiId = process.env.UPI_ID || 'kisaanmela@paytm';
    const transactionId = `TXN${Date.now()}`;
    
    const upiLink = `upi://pay?pa=${upiId}&pn=Kisaanmela&am=${amount}&cu=INR&tn=${description}&tr=${transactionId}`;
    
    return {
      success: true,
      upiLink,
      transactionId,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`
    };
  }
}

module.exports = new PaymentService();
