package edu.brown.cs.student.main.filter;

import edu.brown.cs.student.main.listing.Listing;

import java.util.ArrayList;
import java.util.List;

public class Filter {
    public static List<String> dates;
    public static List<Double> areas;
    public static List<Double> prices;
    public static Double distance;

    public Filter(List<Double> dates, List<Double> prices, List<Double> areas, Double distance) {
//        this.dates = dates;
        this.areas = areas;
        this.prices = prices;
        this.distance = distance;
    }

    public static List<Listing> isValid(List<Listing> listingList) {
        List<Listing> finalList = new ArrayList<>();
        for (Listing ls: listingList) {
            if(ls.getPrice() >= prices.get(0) && ls.getPrice() <= prices.get(1)
                    && ls.getArea() >= areas.get(0) && ls.getArea() <= areas.get(1)
                    && ls.getDistance() <= distance
            ) {
                finalList.add(ls);
            }
        }
        return finalList;
    }

}