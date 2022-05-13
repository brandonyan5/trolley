package edu.brown.cs.student.main.filter;

import edu.brown.cs.student.main.listing.Listing;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


// Used https://www.codespeedy.com/check-if-two-date-ranges-overlap-or-not-in-java/
public class Filter {
    public static List<String> dates;
    public static List<Double> areas;
    public static List<Double> prices;
    public static Double distance;

    public Filter(List<String> dates, List<Double> prices, List<Double> areas, Double distance) {
        this.dates = dates;
        this.areas = areas;
        this.prices = prices;
        this.distance = distance;
    }

    public static boolean dateCheck(List<String> potentialDates) throws ParseException {
        SimpleDateFormat s = new SimpleDateFormat("yyyy-MM-dd");

        Date firstAllowedDate = s.parse(dates.get(0));
        Date secondAllowedDate = s.parse(dates.get(1));

        Date firstPotentialDate = s.parse(potentialDates.get(0));
        Date secondPotentialDate = s.parse(potentialDates.get(1));

        boolean beginningValid = firstAllowedDate.after(firstPotentialDate) || firstAllowedDate.compareTo(firstPotentialDate) == 0;
        boolean endingValid = secondAllowedDate.before(secondPotentialDate) || secondAllowedDate.compareTo(secondPotentialDate) == 0;

        return beginningValid && endingValid;
    }

    public static List<Listing> isValid(List<Listing> listingList) throws ParseException {
        List<Listing> finalList = new ArrayList<>();
        for (Listing ls: listingList) {
            List<String> dateList = new ArrayList<>();
            String startDate = ls.getDate_start();
            String endDate = ls.getDate_end();
            dateList.add(startDate);
            dateList.add(endDate);

            if(ls.getPrice() >= prices.get(0) && ls.getPrice() <= prices.get(1)
                    && ls.getArea() >= areas.get(0) && ls.getArea() <= areas.get(1)
                    && ls.getDistance() <= distance
                    && dateCheck(dateList) // Uncomment this when we have the correct date format given
            ) {
                System.out.println("entered if statement");
                finalList.add(ls);
            }
        }
        return finalList;
    }

    public static void main(String[] args) throws ParseException {
        String d1 = "2000-05-20";
        String d2 = "2005-05-20";

        String p1 = "1999-05-20";
        String p2 = "2005-05-20";

        ArrayList potList = new ArrayList<>();
        potList.add(p1);
        potList.add(p2);

        ArrayList x = new ArrayList();
        x.add(d1);
        x.add(d2);

        ArrayList y = new ArrayList();
        y.add(2);
        y.add(3);

        Filter f = new Filter(x, y, y, 1.0);
        boolean b = f.dateCheck(potList);
        System.out.println(b);
    }
}