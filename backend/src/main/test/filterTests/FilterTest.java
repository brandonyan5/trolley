package filterTests;

import com.google.gson.Gson;
import edu.brown.cs.student.main.filter.Filter;
import edu.brown.cs.student.main.listing.Listing;
import org.junit.Assert;
import org.junit.Test;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class FilterTest {

  @Test
  public void isValidandDates() throws ParseException {
    List<Double> priceRange = new ArrayList<>();
    priceRange.add(5.0);
    priceRange.add(20.0);
    List<Double> areaRange = new ArrayList<>();
    areaRange.add(0.0);
    areaRange.add(1000000.0);
    Filter f = new Filter(new ArrayList<>(), priceRange, areaRange, 500.0);
    Filter.prices = priceRange;
    Filter.areas = areaRange;
    Filter.distance = 10.0;
    String d1 = "2000-05-20";
    String d2 = "2005-05-20";
    List<String> dateList = new ArrayList<>();
    dateList.add(d1);
    dateList.add(d2);
    Filter.dates = dateList;

    String p1 = "1999-05-20";
    String p2 = "2005-05-20";
    List<String> testList1 = new ArrayList<>();
    testList1.add(p1);
    testList1.add(p2);

    String q1 = "2001-05-20";
    String q2 = "2005-05-20";
    List<String> testList2 = new ArrayList<>();
    testList2.add(q1);
    testList2.add(q2);


    Assert.assertFalse(Filter.dateCheck(testList2));

//        Listing l2 = new Listing();
    Listing l1 = new Listing("", 6.0, 11.0, 500.0,
            "1999-05-20", "2005-05-20", "", "", "Listing1");

    Listing l2 = new Listing("", 6.0, 89.0, 500.0,
            "1999-05-20", "2005-05-20", "", "", "Listing1");

    List<Listing> isValidList1 = new ArrayList<>();
    isValidList1.add(l1);
    List<Listing> finalList1 = Filter.isValid(isValidList1);
    System.out.println(finalList1.get(0).getListingName());
    Assert.assertEquals(finalList1.size(), 1);
    finalList1.add(l2);
    List<Listing> finalList2 = Filter.isValid(isValidList1);
    Assert.assertEquals(finalList2.size(), 1);

  }
}