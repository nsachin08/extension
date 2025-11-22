package patterns.abstractfactory.test;

import patterns.abstractfactory.exercise.*;

public class TestAbstractFactory {
    public static void main(String[] args) {
        GUIFactory windows = FactoryProvider.getFactory("Windows");
        GUIFactory mac = FactoryProvider.getFactory("Mac");

        if (windows == null || mac == null) {
            System.out.println("❌ Factories should not be null");
            return;
        }

        if (!windows.createButton().render().equals("Windows Button")) {
            System.out.println("❌ Windows button not rendered correctly");
            return;
        }

        if (!mac.createCheckbox().render().equals("Mac Checkbox")) {
            System.out.println("❌ Mac checkbox not rendered correctly");
            return;
        }

        System.out.println("✅ Abstract Factory Tests Passed");
    }
}
