package patterns.factory.exercise;

public class SimpleFactory {
    public static Product create(String type) {
        if ("A".equals(type)) {
            return new ConcreteProductA();
        } else if ("B".equals(type)) {
            return new ConcreteProductB();
        } else {
            return null;
        }
    }
}
