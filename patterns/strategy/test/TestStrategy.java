package patterns.strategy.test;

import patterns.strategy.exercise.*;

public class TestStrategy {
    public static void main(String[] args) {

        Strategy s1 = new ConcreteStrategyA();
        Strategy s2 = new ConcreteStrategyB();

        Context c1 = new Context(s1);
        Context c2 = new Context(s2);

        if (!c1.executeStrategy().equals("A")) {
            System.out.println("❌ Expected Strategy A");
            return;
        }

        if (!c2.executeStrategy().equals("B")) {
            System.out.println("❌ Expected Strategy B");
            return;
        }

        System.out.println("✅ TEST-PASSED");
    }
}
