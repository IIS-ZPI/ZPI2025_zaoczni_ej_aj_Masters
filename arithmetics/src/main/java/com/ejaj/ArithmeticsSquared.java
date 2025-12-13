package com.ejaj;

public class ArithmeticsSquared implements IArithmeticsSquared {
    @Override
    public double Squared(double A) {
        ArithmeticsMult multiplicator = new ArithmeticsMult();
        return multiplicator.Multiplication(A, A);
    }
}
