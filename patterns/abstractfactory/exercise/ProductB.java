package patterns.abstractFactory.exercise;

public class ProductB implements Product {
    private String name;

    public ProductB(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
