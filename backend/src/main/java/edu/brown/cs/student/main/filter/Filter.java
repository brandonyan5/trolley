package edu.brown.cs.student.main.filter;

import edu.brown.cs.student.main.listing.Listing;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


// Used https://www.codespeedy.com/check-if-two-date-ranges-overlap-or-not-in-java/
public class Filter {
  public static List<String> dates;
  public static List<Double> areas;
  public static List<Double> prices;
  public static Double distance;

  /**
   * constructs the filter.
   * @param dates - date range wanted
   * @param prices - price range wanted
   * @param areas - area range wanted
   * @param distance - distance range wanted
   */
  public Filter(List<String> dates, List<Double> prices, List<Double> areas, Double distance) {
    this.dates = dates;
    this.areas = areas;
    this.prices = prices;
    this.distance = distance;
  }

  /**
   * checks if the start and end dates are within the bounds.
   * @param potentialDates - the start and end date
   * @return - whether the start and end are within the filter date bounds
   * @throws ParseException - if there's an exception when parsing
   */
  public static boolean dateCheck(List<String> potentialDates) throws ParseException {
    SimpleDateFormat s = new SimpleDateFormat("yyyy-MM-dd");

    Date firstAllowedDate = s.parse(dates.get(0));
    Date secondAllowedDate = s.parse(dates.get(1));

    Date firstPotentialDate = s.parse(potentialDates.get(0));
    Date secondPotentialDate = s.parse(potentialDates.get(1));

    boolean beginningValid = firstAllowedDate.after(firstPotentialDate)
            || firstAllowedDate.compareTo(firstPotentialDate) == 0;
    boolean endingValid = secondAllowedDate.before(secondPotentialDate)
            || secondAllowedDate.compareTo(secondPotentialDate) == 0;

    return beginningValid && endingValid;
  }

  /**
   * filters out listings that don't match filters.
   * @param listingList - the original list of listings
   * @return - a new list with bad listings removed
   * @throws ParseException - if there's an exception when parsing.
   */
  public static List<Listing> isValid(List<Listing> listingList) throws ParseException {
    List<Listing> finalList = new ArrayList<>();
    for (Listing ls: listingList) {
      List<String> dateList = new ArrayList<>();
      String startDate = ls.getDateStart();
      String endDate = ls.getDateEnd();
      dateList.add(startDate);
      dateList.add(endDate);

      if (ls.getPrice() >= prices.get(0) && ls.getPrice() <= prices.get(1)
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
}