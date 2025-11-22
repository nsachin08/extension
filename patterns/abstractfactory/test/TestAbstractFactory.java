package patterns.abstractFactory.test;

import patterns.abstractFactory.exercise.*;

public class TestAbstractFactory {
    public static void main(String[] args) {

        AbstractFactory factory = new ConcreteFactory1();
        ProductA p1 = factory.createProductA();
        ProductB p2 = factory.createProductB();

        if (!p1.getName().equals("A1")) {
            System.out.println("❌ Expected Product A1");
            return;
        }

        if (!p2.getName().equals("B1")) {
            System.out.println("❌ Expected Product B1");
            return;
        }

        System.out.println("✅ TEST-PASSED");
    }
}
