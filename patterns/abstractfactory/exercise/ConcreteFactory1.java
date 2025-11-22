package patterns.abstractFactory.exercise;

public class ConcreteFactory1 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ProductA("A1");
    }

    @Override
    public ProductB createProductB() {
        return new ProductB("B1");
    }
}
