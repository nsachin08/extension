package patterns.factory.test;

import patterns.factory.exercise.*;

public class TestFactory {
    public static void main(String[] args) {

        Product a = SimpleFactory.create("A");
        Product b = SimpleFactory.create("B");

        if (a == null || b == null) {
            System.out.println("❌ Factory returned null");
            return;
        }

        if (!a.getName().equals("A")) {
            System.out.println("❌ Expected Product A name = 'A'");
            return;
        }

        if (!b.getName().equals("B")) {
            System.out.println("❌ Expected Product B name = 'B'");
            return;
        }

        System.out.println("✅ TEST-PASSED"); // <-- Standard success line
    }
}
