package patterns.strategy.exercise;

public class PaymentContext {

    private PaymentStrategy strategy;

    public PaymentContext(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public String executePayment(int amount) {
        if (strategy == null) return "No strategy set";
        return strategy.pay(amount);
    }
}
