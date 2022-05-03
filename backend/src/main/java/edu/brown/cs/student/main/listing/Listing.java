package edu.brown.cs.student.main.listing;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
  
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

    public String getDate_start() {
        return date_start;
    }

    public String getDate_end() {
        return date_end;
    }

    public Double getDistance() {
        return distance;
    }

    private String address;
    private Double price;
    private Double area;
    private String date_start;
    private String date_end;
    private Double distance;
    private String ownerEmail;
    private String userEmail;
    private String listingName;
    private List<Double> numeric;
    private List<Double> normalizedNumeric;
    private Double euclideanDistance;

    public String getListingName() {
        return listingName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Listing(String address, Double price, Double area, String date_start, String date_end, String ownerEmail, String userEmail, String listingName) {
        this.address = address;
        this.price = price;
        this.area = area;
        this.date_start = date_start;
        this.date_end = date_end;
        this.ownerEmail = ownerEmail;
        this.userEmail = userEmail;
        this.listingName = listingName;
    }

    public List<Double> getNumeric() {
        return this.numeric;
    }

    public Double geteuclideanDistance() {
        return this.euclideanDistance;
    }

    public void seteuclideanDistance(Double dist) {
        this.euclideanDistance = dist;
    }

    public List<Double> getNormalizedNumeric() {
        return this.normalizedNumeric;
    }

    public void setNormalizedNumeric(List<Double> ls) {
        this.normalizedNumeric = ls;
    }

    public void setDistance(Double dist)  {
        this.distance = dist;
    }

    public void setNumeric() {
        List<Double> x = new ArrayList<>();
        x.add(price);
        x.add(area);
        x.add(distance); // make sure to call setDistance before doing this
        this.numeric = x;
    }

    public void setDistanceForReal(String userAddress) {
        Random rand = new Random();
        Double randomDouble = rand.nextDouble() * 10;
        this.distance = randomDouble;
    }
}




































