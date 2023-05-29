package com.mathlab4;

import java.io.*;
import java.util.Arrays;

import com.google.gson.Gson;
import com.mathlab4.DataObject.DataFromJson;
import com.mathlab4.DataObject.DataToJson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "processServlet", value = "/process-servlet")
public class ProcessServlet extends HttpServlet {
    private String message;

    public void init() {
        message = "Hello World!";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {


        response.setContentType("text/html");

        // Hello
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>" + message + "</h1>");
        out.println("</body></html>");
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = req.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
            buffer.append(System.lineSeparator());
        }
        Gson gson = new Gson();
        DataFromJson data = gson.fromJson(buffer.toString(),DataFromJson.class);

//        System.out.println("data: " + data.getPoints() +"\n"+  Arrays.toString(data.getAllX()) +"\n"+ Arrays.toString(data.getAllY()));

        DataToJson toJSN = Calculator.getAnswer(data.getPoints(), data.getAllX(), data.getAllY());

        String json = gson.toJson(toJSN);

//        System.out.println(json);
//
//        double[] best = new double[5];
//
//        best[0] = toJSN.linearApproximation_SKO;
//        best[1] = toJSN.exponentialApproximation_SKO;
//        best[2] = toJSN.logarithmicallyApproximation_SKO;
//        best[3] = toJSN.powerApproximation_SKO;
//        best[4] = toJSN.squareApproximation_SKO;
//
//        double buff = Double.MAX_VALUE, buff_i = 0;
//        for (int i = 0; i < best.length; i++) {
//            if (best[i] < buff){
//                buff = best[i];
//                buff_i = i;
//            }
//        }
//
//        System.out.println("best approximation " + buff_i);

        PrintWriter out = resp.getWriter();
        out.println(json);
    }

    public void destroy() {
    }
}