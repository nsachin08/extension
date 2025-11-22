package patterns.strategy.test;

import patterns.strategy.exercise.*;

public class TestStrategy {
    public static void main(String[] args) {
        PaymentContext ctx = new PaymentContext(new CardPaymentStrategy());

        String msg1 = ctx.executePayment(100);
        if (!msg1.equals("Paid 100 using Card")) {
            System.out.println("❌ Card payment incorrect: " + msg1);
            return;
        }

        ctx.setStrategy(new UpiPaymentStrategy());
        String msg2 = ctx.executePayment(200);
        if (!msg2.equals("Paid 200 using UPI")) {
            System.out.println("❌ UPI payment incorrect: " + msg2);
            return;
        }

        System.out.println("✅ Strategy Pattern Tests Passed");
    }
}
