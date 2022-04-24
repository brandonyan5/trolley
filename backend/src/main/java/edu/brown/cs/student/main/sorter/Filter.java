package edu.brown.cs.student.main.sorter;

import edu.brown.cs.student.main.listing.Listing;

import java.util.ArrayList;
import java.util.List;

public class Filter {
    public static List<Double> dates;
    public static List<Double> areas;
    public static List<Double> prices;
    public static Double distance;

//    public Filter(List<Double> dates, List<Double> areas, List<Double> prices, Double distance) {
//        this.dates = dates;
//        this.areas = areas;
//        this.prices = prices;
//        this.distance = distance;
//    }

    public List<Listing> isValid(List<Listing> listingLIst) {
        List<Listing> finalList = new ArrayList<>();
        for (Listing ls: listingLIst) {
            if(ls.price >= prices.get(0) && ls.price <= prices.get(1)
                    && ls.area >= areas.get(0) && ls.area <= areas.get(1)
            ) {
                finalList.add(ls);
            }
        }
        return finalList;
    }
}
