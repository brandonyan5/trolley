package edu.brown.cs.student.main.listing;

import java.util.ArrayList;
import java.util.List;

public class Listing {
  public String getAddress() {
    return address;
  }

  public Double getPrice() {
    return price;
  }

  public Double getArea() {
    return area;
  }

  public String getDateStart() {
    return dateStart;
  }

  public String getDateEnd() {
    return dateEnd;
  }

  public Double getDistance() {
    return distance;
  }

  private String address;
  private Double price;
  private Double area;
  private String dateStart;
  private String dateEnd;
  private Double distance;
  private String ownerID;
  private String userID;
  private String listingName;
  private List<Double> numeric;
  private List<Double> normalizedNumeric;
  private Double euclideanDistance;

  public String getListingName() {
    return listingName;
  }

  public String getOwnerID() {
    return ownerID;
  }

  public String getUserID() {
    return userID;
  }

  /**
   * constructor to create a listing.
   * @param address - address of the listing.
   * @param distance - how far listing is from user
   * @param price - price of listing
   * @param area - area of listing
   * @param dateStart - start date of listing
   * @param dateEnd - end date of listing
   * @param ownerID - id of the owner
   * @param userID - id of the user
   * @param listingName - name of the listing
   */
  public Listing(String address, Double distance, Double price, Double area, String dateStart,
                  String dateEnd, String ownerID, String userID, String listingName) {
    this.address = address;
    this.distance = distance;
    this.price = price;
    this.area = area;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.ownerID = ownerID;
    this.userID = userID;
    this.listingName = listingName;
  }

  public List<Double> getNumeric() {
    return this.numeric;
  }

  public Double getEuclideanDistance() {
    return this.euclideanDistance;
  }

  public void setEuclideanDistance(Double dist) {
    this.euclideanDistance = dist;
  }

  public List<Double> getNormalizedNumeric() {
    return this.normalizedNumeric;
  }

  public void setNormalizedNumeric(List<Double> ls) {
    this.normalizedNumeric = ls;
  }

  /**
   * sets the list of numeric data.
   */
  public void setNumeric() {
    List<Double> x = new ArrayList<>();
    x.add(price);
    x.add(area);
    x.add(distance); // make sure to call setDistance before doing this
    this.numeric = x;
  }
}