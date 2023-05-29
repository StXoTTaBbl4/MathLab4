package com.mathlab4.DataObject;

public class MatrixObject {
    double a_0;
    double a_1;
    double a_2;

    public static MatrixObject solveMatrix_3x3(double[][] a, double[] b){
        double delta = (a[0][0] * a[1][1] * a[2][2] + a[1][0] * a[2][1] * a[0][2] + a[0][1] * a[1][2] * a[2][0]
                - a[0][2] * a[1][1] * a[2][0] - a[0][1] * a[1][0] * a[2][2] - a[0][0] * a[1][2] * a[2][1]);
        double delta2 = (a[0][0] * b[1] * a[2][2] + a[1][0] * b[2] * a[0][2] + b[0] * a[1][2] * a[2][0]
                - a[0][2] * b[1] * a[2][0] - b[0] * a[1][0] * a[2][2] - a[0][0] * a[1][2] * b[2]);
        double delta1 = (a[0][0] * a[1][1] * b[2] + a[1][0] * a[2][1] * b[0] + a[0][1] * b[1] * a[2][0]
                - b[0] * a[1][1] * a[2][0] - a[0][1] * a[1][0] * b[2] - a[0][0] * b[1] * a[2][1]);
        double delta3 = (b[0] * a[1][1] * a[2][2] + b[1] * a[2][1] * a[0][2] + a[0][1] * a[1][2] * b[2]
                - a[0][2] * a[1][1] * b[2] - a[0][1] * b[1] * a[2][2] - b[0] * a[1][2] * a[2][1]);

        MatrixObject object = new MatrixObject();
        if(delta != 0) {
            object.setA_0(delta1 / delta);
            object.setA_1(delta2 / delta);
            object.setA_2(delta3 / delta);
            return object;
        }
        else
            return null;
    }

    public static MatrixObject solveMatrix_2x2(double[][] a, double[] b){
        double delta = a[0][0] * a[1][1] - a[0][1] * a[1][0];
        double delta1 = a[0][0] * b[1] - b[0] * a[1][0];
        double delta2 = b[0] * a[1][1] - a[0][1] * b[1];

        MatrixObject object = new MatrixObject();
        if(delta != 0) {
            object.setA_0(delta1 / delta);
            object.setA_1(delta2 / delta);
            return object;
        }
        else
            return null;
    }

    public double getA_0() {
        return a_0;
    }

    public void setA_0(double a_0) {
        this.a_0 = a_0;
    }

    public double getA_1() {
        return a_1;
    }

    public void setA_1(double a_1) {
        this.a_1 = a_1;
    }

    public double getA_2() {
        return a_2;
    }

    public void setA_2(double a_2) {
        this.a_2 = a_2;
    }
}
