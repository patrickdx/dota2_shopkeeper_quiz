package backend;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.jsoup.nodes.Document;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;


public class Item implements Comparable<Item> {

    private String name;
    private String[] stats;
    private String icon;
    private int price;


    public Item(Document itemWiki){

        name = itemData.getName(itemWiki);
        stats = itemData.getStats(itemWiki);
        icon = itemData.getIconHD(itemWiki);
        price = itemData.getPrice(itemWiki);

    }
    public Item(){

    }

    public Item(String name) {
        this.name = name;
    }


    public String getName() {
        return name;
    }

    public String[] getStats() {
        return stats;
    }

    public String getIcon() {
        return icon;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStats(String[] stats) {
        this.stats = stats;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getPrice(){
        return price;
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item item = (Item) o;
        return Objects.equals(name, item.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return getName();
    }



    // can use existing implementation of String's compareTo which compares in alphabetical order
    public int compareTo(Item o) {
        return this.getName().compareTo(o.getName());
    }
}
