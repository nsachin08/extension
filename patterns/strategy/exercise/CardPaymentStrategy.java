package patterns.strategy.exercise;

public class CardPaymentStrategy implements PaymentStrategy {
    @Override
    public String pay(int amount) {
        return "Paid " + amount + " using Card";
    }
}
