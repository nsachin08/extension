package patterns.abstractFactory.exercise;

public class ProductA implements Product {
    private String name;

    public ProductA(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
