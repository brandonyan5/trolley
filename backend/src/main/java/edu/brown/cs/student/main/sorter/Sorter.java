package edu.brown.cs.student.main.sorter;

import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class Sorter {

    public Double lowestPrice;
    public Double highestArea;

    public List<Listing> sortAll(List<Listing> listingList, double[] filterWeights) {
        System.out.println("FILTER WEIGHTS: " + Arrays.toString(filterWeights));
        this.normalizer(listingList, filterWeights);
        this.euclideanDistanceSetter(listingList);
        return this.sorter(listingList);
    }

    public void normalizer(List<Listing> listingList, double[] filterWeights) {
        double highestPrice = this.extremePrices(listingList)[0];
        double lowestPrice = this.extremePrices(listingList)[1];
        this.lowestPrice = lowestPrice;

        double highestArea = this.extremeAreas(listingList)[0];
        this.highestArea = highestArea;
        double lowestArea = this.extremeAreas(listingList)[1];

        double highestDistance = this.extremeDistances(listingList)[0];
        double lowestDistance = this.extremeDistances(listingList)[1];

        for(Listing ls: listingList) {
            List<Double> temp = new ArrayList<>();
            // NOTE: new normalization divides by max possible GLOBAL value to ensure meaningful distribution in [0,1]
//            double newPrice = (ls.getPrice() - lowestPrice) / (1+ highestPrice - lowestPrice);
            double newPrice = ls.getPrice() / 10;
//            double newDistance = (ls.getDistance() - lowestDistance) / (1+ highestDistance - lowestDistance);
            double newDistance = ls.getDistance() / 5;
//            double newArea = (ls.getArea() - lowestArea) / (1+ highestArea - lowestArea);
            double newArea = ls.getArea()  / 200;

            System.out.println("BEFORE weighting. price, dist, area = ");
            System.out.println(newPrice);
            System.out.println(newDistance);
            System.out.println(newArea);

            // apply filter weights on normalized [0,1] values
            newPrice *= filterWeights[0];
            newDistance *= filterWeights[1];
            newArea *= filterWeights[2];

            System.out.println("AFTER weighting");
            System.out.println(newPrice);
            System.out.println(newDistance);
            System.out.println(newArea);


            temp.add(newPrice);
            temp.add(newArea);
            temp.add(newDistance);
            ls.setNormalizedNumeric(temp);
        }
    }

    public void euclideanDistanceSetter(List<Listing> listingList) {
        for(Listing ls: listingList) {
            double priceSquared = Math.pow((ls.getNormalizedNumeric().get(0) - 0) * 10, 2); // comparing to lowestPrice (Not necessarily 0, but the scaled value from [0,1] is 0.
            double areaSquared = Math.pow((1 - ls.getNormalizedNumeric().get(1)) * 10, 2); // want larger area = smaller Euclidean dist
            double dSquared = Math.pow(ls.getNormalizedNumeric().get(2) * 10, 2);
            double Euclidean = Math.sqrt(dSquared + priceSquared + areaSquared);
            ls.seteuclideanDistance(Euclidean);
        }
    }

    public List<Listing> sorter(List<Listing> listingList) {
        listingList.sort(Comparator.comparing(Listing::geteuclideanDistance));
        return listingList;
    }

    public Double[] extremePrices(List<Listing> listingList) {
        Double[] result = new Double[2];
        result[0] = (0.0);
        result[1] = (Double.MAX_VALUE);
        for(Listing ls: listingList) {
            ls.setNumeric();
            double temp = ls.getNumeric().get(0);
            result[0] = Math.max(temp, result[0]);
            result[1] = Math.min(temp, result[1]);
        }
        return result;
    }

    public Double[] extremeAreas(List<Listing> listingList) {
        Double[] result = new Double[2];
        result[0] = (0.0);
        result[1] = (Double.MAX_VALUE);
        for(Listing ls: listingList) {
            double temp = ls.getNumeric().get(1);
            result[0] = Math.max(temp, result[0]);
            result[1] = Math.min(temp, result[1]);
        }
        return result;
    }

    public Double[] extremeDistances(List<Listing> listingList) {
        Double[] result = new Double[2];
        result[0] = (0.0);
        result[1] = (Double.MAX_VALUE);
        for(Listing ls: listingList) {
            double temp = ls.getNumeric().get(2);
            result[0] = Math.max(temp, result[0]);
            result[1] = Math.min(temp, result[1]);
        }
        return result;
    }

//    public static void main(String[] args) {
//        Double[] y = new Double[2];
//        y[0] = 2.0;
//        y[0] = 3.0;
//        y[1] = 5.0;
//        int x = 5;
//
//        Listing listing0 = new Listing("rando0", 10.0, 40.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
//        listing0.setDistance(5.0);
//        Listing listing1 = new Listing("rando1", 20.0, 900.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
//        listing1.setDistance(10.0);
//        Listing listing2 = new Listing("rando2", 30.0, 40.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
//        listing2.setDistance(30.0);
//        Sorter s = new Sorter();
//        List<Listing> l = new ArrayList<>();
//        l.add(listing2);
//        l.add(listing1);
//        l.add(listing0);
//        List<Double> priceRange = new ArrayList<>();
//        priceRange.add(5.0);
//        priceRange.add(20.0);
//        List<Double> areaRange = new ArrayList<>();
//        areaRange.add(0.0);
//        areaRange.add(1000000.0);
//        Filter f = new Filter(new ArrayList<>(), priceRange, areaRange, 500.0);
//        // List<Listing> p = f.isValid(l);
//        // NOTE: UNCOMMENTED line below
////        s.sortAll(l);
//
//    }
}