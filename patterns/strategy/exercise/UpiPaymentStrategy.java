package patterns.strategy.exercise;

public class UpiPaymentStrategy implements PaymentStrategy {
    @Override
    public String pay(int amount) {
        return "Paid " + amount + " using UPI";
    }
}
