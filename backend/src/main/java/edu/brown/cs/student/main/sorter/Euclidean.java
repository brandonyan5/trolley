//package edu.brown.cs.student.main.sorter;
//
//import java.util.List;
//
///**
// * A class for Euclidean distance. This is just one type of distance that implements kd_distance.
// */
//
//public class Euclidean implements KDdistance {
//    /**
//     * Takes in two Nodes and returns the Euclidean distance.
//     *
//     * @param n1 - A Node
//     * @param n2 - Another Node
//     * @return - The euclidean distance between the two Nodes based on the coordinates
//     * of the object inside of them
//     * (Student)
//     */
//
//    @Override
//    public double distance(Node n1, Node n2) {
//        List<Double> n1Cords = n1.getS().getNumeric();
//        List<Double> n2Cords = n2.getS().getNumeric();
//        double result = 0;
//        for (int i = 0; i < n1Cords.size(); i++) {
//            double component = Math.pow(n1Cords.get(i) - n2Cords.get(i), 2);
//            result = result + component; }
//        result = Math.sqrt(result);
//        return result;
//    }
//}
//
