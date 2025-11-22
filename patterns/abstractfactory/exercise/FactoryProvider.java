package patterns.abstractfactory.exercise;

public class FactoryProvider {
    public static GUIFactory getFactory(String os) {
        if ("Windows".equalsIgnoreCase(os)) {
            return new WindowsFactory();
        } else if ("Mac".equalsIgnoreCase(os) || "MacOS".equalsIgnoreCase(os)) {
            return new MacFactory();
        } else {
            return null;
        }
    }
}
