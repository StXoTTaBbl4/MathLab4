package com.mathlab4;

import com.mathlab4.DataObject.DataToJson;
import com.mathlab4.DataObject.MatrixObject;

public class Calculator {

    static DataToJson dataToJson = new DataToJson();

    static double sum_x = 0,
                    sum_x_square = 0,
                    sum_x_cube = 0,
                    sum_x_tesseract= 0,
                    sum_ln_x = 0,
                    sum_ln_x_square = 0,

                    sum_y = 0,
                    sum_y_cube = 0,
                    sum_y_tesseract= 0,
                    sum_y_square = 0,
                    sum_ln_y = 0,

                    sum_xy = 0,
                    sum_x_square_y = 0,
                    sum_ln_x_ln_y = 0,
                    sum_x_ln_y = 0,
                    sum_y_ln_x = 0;

    static DataToJson getAnswer(int points,double[] allX,double[] allY){
        setUpBasics(points, allX, allY);
        linearApproximation(points, allX, allY);
        squareApproximation(points, allX, allY);
        powerApproximation(points, allX, allY);
        exponentialApproximation(points, allX, allY);
        logarithmicallyApproximation(points, allX, allY);

        return dataToJson;
    }

    private static void setUpBasics(int points,double[] allX,double[] allY){
        double buff_x, buff_y;
        for (int i = 0; i < points; i++) {
            buff_x = allX[i];
            buff_y = allY[i];

            sum_x += buff_x;
            sum_x_square += Math.pow(buff_x,2);
            sum_x_cube += Math.pow(buff_x,3);
            sum_x_tesseract += Math.pow(buff_x,4);

            sum_y += buff_y;
            sum_y_square += Math.pow(buff_y,2);
            sum_y_cube += Math.pow(buff_y,3);
            sum_y_tesseract += Math.pow(buff_y,4);


            sum_xy += buff_x * buff_y;
            sum_x_square_y += Math.pow(buff_x,2) * buff_y;

            //выпендрёжники проклятые
            if(buff_y != 0) {
                sum_ln_y += Math.log(buff_y);
                sum_x_ln_y += buff_x * Math.log(buff_y);
            }
            if ( buff_x != 0) {
                sum_ln_x += Math.log(buff_x);
                sum_ln_x_square += Math.log(Math.pow(buff_x, 2));
                sum_y_ln_x += buff_y * Math.log(buff_x);
            }
            if(buff_x != 0 && buff_y != 0) {
                sum_ln_x_ln_y += Math.log(buff_x) * Math.log(buff_y);
            }


        }
    }

    private static void linearApproximation(int points,double[] allX,double[] allY){

        double delta = sum_x_square*points - sum_x * sum_x;
        double a = (sum_xy*points - sum_x*sum_y)/delta;
        double b = (sum_x_square*sum_y - sum_x*sum_xy)/delta;

        double[] appr_allY = new double[points];
        double[] epsilon = new double[points];
        double S = 0;
        double buff;
        for (int i = 0; i < points; i++) {
            buff = a*allX[i] + b;
            appr_allY[i] = buff;
            epsilon[i] = allY[i] - buff;
            S += Math.pow(allY[i] - buff,2);
        }

        dataToJson.linearApproximation_a = a;
        dataToJson.linearApproximation_b = b;
        dataToJson.linearApproximation_y = appr_allY;
        dataToJson.linearApproximation_epsilon = epsilon;
        dataToJson.linearApproximation_S = S;
        dataToJson.linearApproximation_SKO = Math.sqrt(S/points);

//        System.out.println( dataToJson.linearApproximation_SKO);
//        System.out.println("linearApproximation - done");
    }

    private static void squareApproximation(int points,double[] allX,double[] allY){
        double[][] d_array = {{points,sum_x,sum_x_square},
                            {sum_x,sum_x_square,sum_x_cube},
                            {sum_x_square,sum_x_cube,sum_x_tesseract}};
        double[] s_array = {sum_y,sum_xy,sum_x_square_y};
        MatrixObject object = MatrixObject.solveMatrix_3x3(d_array,s_array);



        double[] appr_allY = new double[points];
        double[] epsilon = new double[points];
        double S = 0;
        double buff,a,b,c;

        if (object != null){
            a = object.getA_0();
            b = object.getA_1();
            c = object.getA_2();
        }
        else{
            a = -1;
            b = -1;
            c = -1;
            return;
        }

        for (int i = 0; i < points; i++) {
            buff = a*Math.pow(allX[i],2) + b*allX[i] +c;
            appr_allY[i] = buff;
            epsilon[i] = allY[i] - buff;
            S += Math.pow(allY[i] - buff,2);
        }

        dataToJson.squareApproximation_a_0 = a;
        dataToJson.squareApproximation_a_1 = b;
        dataToJson.squareApproximation_a_2 = c;
        dataToJson.squareApproximation_epsilon = epsilon;
        dataToJson.squareApproximation_y = appr_allY;
        dataToJson.squareApproximation_S = S;
        dataToJson.squareApproximation_SKO = Math.sqrt(S/points);

//       System.out.println( dataToJson.squareApproximation_SKO);
//        System.out.println("squareApproximation - done");
    }

    private static void powerApproximation(int points,double[] allX,double[] allY){
        double[][] d_array = {{points,sum_ln_x},
                            {sum_ln_x,sum_ln_x_square}};
        double[] s_array = {sum_ln_y,sum_ln_x_ln_y};
        MatrixObject object = MatrixObject.solveMatrix_2x2(d_array,s_array);

        double[] appr_allY = new double[points];
        double[] epsilon = new double[points];
        double S = 0;
        double buff,a,b;
        if (object != null){
            a = object.getA_0();
            b = object.getA_1();
        }
        else{
            //System.out.println("powerApproximation error");
            a = -1;
            b = -1;
            return;
        }

        for (int i = 0; i < points; i++) {
            buff = a*Math.pow(allX[i],b);
            appr_allY[i] = buff;
            epsilon[i] = allY[i] - buff;
            S += Math.pow(allY[i] - buff,2);
        }

        dataToJson.powerApproximation_a = a;
        dataToJson.powerApproximation_b = b;
        dataToJson.powerApproximation_y = appr_allY;
        dataToJson.powerApproximation_epsilon = epsilon;
        dataToJson.powerApproximation_S = S;
        dataToJson.powerApproximation_SKO = Math.sqrt(S/points);

//        System.out.println( dataToJson.powerApproximation_SKO);
//        System.out.println("powerApproximation - done");
    }

    private static void exponentialApproximation(int points,double[] allX,double[] allY){
        double[] appr_allY = new double[points];
        double[] epsilon = new double[points];
        double S = 0;
        double[][] d_array = {{points,sum_x},
                {sum_x,sum_x_square}};
        double[] s_array = {sum_ln_y,sum_x_ln_y};
        MatrixObject object = MatrixObject.solveMatrix_2x2(d_array,s_array);
        double buff,a,b;
        if (object != null){
            a = object.getA_0();
            b = object.getA_1();
        }
        else{
            //System.out.println("expApproximation error");
            a = -1;
            b = -1;;
            return;
        }

        for (int i = 0; i < points; i++) {
            buff = Math.exp(a*allX[i]+b);
            appr_allY[i] = buff;
            epsilon[i] = allY[i] - buff;
            S += Math.pow(allY[i] - buff,2);
        }

        dataToJson.exponentialApproximation_a = a;
        dataToJson.exponentialApproximation_b = b;
        dataToJson.exponentialApproximation_y = appr_allY;
        dataToJson.exponentialApproximation_epsilon = epsilon;
        dataToJson.exponentialApproximation_S = S;
//        System.out.println(S);
        dataToJson.exponentialApproximation_SKO = Math.sqrt(S/points);

//        System.out.println( dataToJson.exponentialApproximation_SKO);
//        System.out.println("exponentialApproximation - done");

    }

    private static void logarithmicallyApproximation(int points,double[] allX,double[] allY){
        double[] appr_allY = new double[points];
        double[] epsilon = new double[points];
        double S = 0;
        double[][] d_array = {{points,sum_ln_x},
                            {sum_ln_x,sum_ln_x_square}};
        double[] s_array = {sum_y,sum_y_ln_x};
        MatrixObject object = MatrixObject.solveMatrix_2x2(d_array,s_array);
        double buff,a,b;
        if (object != null){
            a = object.getA_0();
            b = object.getA_1();
        }
        else{
            a = -1;
            b = -1;;
            return;
        }

        for (int i = 0; i < points; i++) {
            buff = a*Math.log(allX[i])+b;
            appr_allY[i] = buff;
            epsilon[i] = allY[i] - buff;
            S += Math.pow(allY[i] - buff,2);
        }

        dataToJson.logarithmicallyApproximation_a = a;
        dataToJson.logarithmicallyApproximation_b = b;
        dataToJson.logarithmicallyApproximation_y = appr_allY;
        dataToJson.logarithmicallyApproximation_epsilon = epsilon;
        dataToJson.logarithmicallyApproximation_S = S;
//        System.out.println(S);
        dataToJson.logarithmicallyApproximation_SKO = Math.sqrt(S/points);

//        System.out.println( dataToJson.logarithmicallyApproximation_SKO);
//        System.out.println("logarithmicallyApproximation - done");
    }


}
