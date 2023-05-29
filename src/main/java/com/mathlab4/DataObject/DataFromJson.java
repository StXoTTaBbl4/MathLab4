package com.mathlab4.DataObject;

public class DataFromJson {
    private int points;
    private double[] allX;
    private double[] allY;

    public DataFromJson() {
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public double[] getAllX() {
        return allX;
    }

    public void setAllX(double[] allX) {
        this.allX = allX;
    }

    public double[] getAllY() {
        return allY;
    }

    public void setAllY(double[] allY) {
        this.allY = allY;
    }
}
