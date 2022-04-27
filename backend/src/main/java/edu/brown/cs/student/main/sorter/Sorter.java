package edu.brown.cs.student.main.sorter;

import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;
import org.checkerframework.checker.units.qual.A;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Sorter {

    public Double lowestPrice;
    public Double highestArea;

    public List<Listing> sortAll(List<Listing> listingList) {
        this.normalizer(listingList);
        this.distanceSetter(listingList);
        return this.sorter(listingList);
    }

    public void normalizer(List<Listing> listingList) {

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
            double newPrice = (ls.getPrice() - lowestPrice) / (highestPrice - lowestPrice);
            double newArea = (ls.getArea() - lowestArea) / (highestArea - lowestArea);
            double newDistance = (ls.getDistance() - lowestDistance) / (highestDistance - lowestDistance);
            temp.add(newPrice);
            temp.add(newArea);
            temp.add(newDistance);
            ls.setNormalizedNumeric(temp);
        }
    }

    public void distanceSetter(List<Listing> listingList) {
        for(Listing ls: listingList) {
            double priceSquared = Math.pow((ls.getNormalizedNumeric().get(0) - 0), 2); // comparing to lowestPrice (Not necessarily 0, but the scaled value from [0,1] is 0.
            double areaSquared = Math.pow(1 - ls.getNormalizedNumeric().get(1), 2);
            double dSquared = Math.pow(ls.getNormalizedNumeric().get(2), 2);
            double Euclidean = Math.sqrt(10 * dSquared + 10 * priceSquared + 10 * areaSquared);
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

    public static void main(String[] args) {
        Double[] y = new Double[2];
        y[0] = 2.0;
        y[0] = 3.0;
        y[1] = 5.0;
        int x = 5;

        Listing listing0 = new Listing("rando0", 10.0, 40.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
        listing0.setDistance(5.0);
        Listing listing1 = new Listing("rando1", 20.0, 900.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
        listing1.setDistance(10.0);
        Listing listing2 = new Listing("rando2", 30.0, 40.0, "jan", "feb", "rando@gmail.com", "user@gmail.com", "cool listing");
        listing2.setDistance(30.0);
        Sorter s = new Sorter();
        List<Listing> l = new ArrayList<>();
        l.add(listing2);
        l.add(listing1);
        l.add(listing0);
        List<Double> priceRange = new ArrayList<>();
        priceRange.add(5.0);
        priceRange.add(20.0);
        List<Double> areaRange = new ArrayList<>();
        areaRange.add(0.0);
        areaRange.add(1000000.0);
        Filter f = new Filter(new ArrayList<>(), priceRange, areaRange, 500.0);
        List<Listing> p = f.isValid(l);
        s.sortAll(p);

    }
}
